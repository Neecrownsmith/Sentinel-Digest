import os
from dotenv import load_dotenv
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
import pickle
import sys
import os
import django

load_dotenv()

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from articles.models import Article
from jobs.models import Job
from similarity.models import ArticleEmbedding, JobEmbedding 


faiss_model = os.getenv("FAISS_MODEL", "all-MiniLM-L6-v2")
model = SentenceTransformer(faiss_model)
similarity_threshold = float(os.getenv("SIMILARITY_THRESHOLD", "0.85"))
default_lookback_days = int(os.getenv("SIMILARITY_LOOKBACK_DAYS", "3"))


# Cache keys
FAISS_INDEX_CACHE_KEY = "faiss_index"
FAISS_ARTICLE_IDS_CACHE_KEY = "faiss_article_ids"


def encode_article(article):
    """
    Encode an article's content into an embedding vector.
    
    Args:
        article: Article instance
        
    Returns:
        numpy.ndarray: Embedding vector
    """
    # Combine title, excerpt, and content for better representation
    text = f"{article.title}\n\n{article.excerpt}\n\n{article.content}"
    embedding = model.encode(text, convert_to_tensor=False, normalize_embeddings=True)
    
    # Save embedding to database
    ArticleEmbedding.objects.update_or_create(
        article=article,
        defaults={"embedding_vector": embedding.tobytes()}
    )
    
    return embedding


def decode_embedding(embedding_binary):
    """
    Decode binary embedding back to numpy array.
    
    Args:
        embedding_binary: Binary embedding from database
        
    Returns:
        numpy.ndarray: Decoded embedding vector
    """
    embedding_array = np.frombuffer(embedding_binary, dtype=np.float32)
    return embedding_array


def encode_job(job):
    """
    Encode a job's content into an embedding vector.
    
    Args:
        job: Job instance
        
    Returns:
        numpy.ndarray: Embedding vector
    """
    # Combine role and description for better representation
    text = f"{job.role}\n\n{job.description}"
    embedding = model.encode(text, convert_to_tensor=False, normalize_embeddings=True)
    
    # Save embedding to database
    JobEmbedding.objects.update_or_create(
        job=job,
        defaults={"embedding_vector": embedding.tobytes()}
    )
    
    return embedding


def build_faiss_index(lookback_days=None, model_type='article'):
    """
    Build FAISS index from articles or jobs with embeddings in the database.
    
    Args:
        lookback_days: Number of days to look back. 
                      If None, includes all items.
                      If specified, only includes items from the last N days.
        model_type: 'article' or 'job'
    
    Returns:
        tuple: (faiss.Index, list of IDs)
    """
    print(f"Building FAISS index for {model_type}s from database...")
    
    # Get embeddings based on model type
    if model_type == 'article':
        embeddings_query = ArticleEmbedding.objects.select_related('article')
        
        if lookback_days is not None:
            cutoff_date = timezone.now() - timedelta(days=lookback_days)
            embeddings_query = embeddings_query.filter(article__created_at__gte=cutoff_date)
            print(f"Filtering articles from last {lookback_days} days (since {cutoff_date.date()})")
        
        embeddings_data = embeddings_query.all()
        
        if not embeddings_data.exists():
            print("No article embeddings found in database")
            return None, []
        
        embeddings = []
        item_ids = []
        
        for emb_obj in embeddings_data:
            embedding = decode_embedding(emb_obj.embedding_vector)
            embeddings.append(embedding)
            item_ids.append(emb_obj.article.id)
    
    elif model_type == 'job':
        embeddings_query = JobEmbedding.objects.select_related('job')
        
        if lookback_days is not None:
            cutoff_date = timezone.now() - timedelta(days=lookback_days)
            embeddings_query = embeddings_query.filter(job__created_at__gte=cutoff_date)
            print(f"Filtering jobs from last {lookback_days} days (since {cutoff_date.date()})")
        
        embeddings_data = embeddings_query.all()
        
        if not embeddings_data.exists():
            print("No job embeddings found in database")
            return None, []
        
        embeddings = []
        item_ids = []
        
        for emb_obj in embeddings_data:
            embedding = decode_embedding(emb_obj.embedding_vector)
            embeddings.append(embedding)
            item_ids.append(emb_obj.job.id)
    
    else:
        raise ValueError(f"Invalid model_type: {model_type}. Must be 'article' or 'job'")
    
    # Convert to numpy array
    embeddings_array = np.array(embeddings).astype('float32')
    
    # Create FAISS index (using Inner Product for cosine similarity with normalized vectors)
    dimension = embeddings_array.shape[1]
    index = faiss.IndexFlatIP(dimension)
    
    # Normalize vectors for cosine similarity
    faiss.normalize_L2(embeddings_array)
    
    # Add vectors to index
    index.add(embeddings_array)
    
    print(f"FAISS index built with {len(item_ids)} {model_type}s")
    
    # Cache the index
    _cache_faiss_index(index, item_ids, model_type=model_type)
    
    return index, item_ids


def _cache_faiss_index(index, item_ids, model_type='article'):
    """
    Save FAISS index and item IDs to cache.
    
    Args:
        index: FAISS index
        item_ids: List of item IDs (article or job IDs)
        model_type: 'article' or 'job'
    """
    # Serialize index
    serialized_index = faiss.serialize_index(index)
    
    # Use different cache keys for articles and jobs
    index_key = f"faiss_index_{model_type}"
    ids_key = f"faiss_{model_type}_ids"
    
    cache.set(index_key, serialized_index, timeout=None)
    cache.set(ids_key, item_ids, timeout=None)
    
    print(f"FAISS {model_type} index cached successfully")


def load_faiss_index(lookback_days=None, model_type='article'):
    """
    Load FAISS index from cache or rebuild if not available.
    
    Args:
        lookback_days: Number of days to look back.
                      If None, includes all items.
        model_type: 'article' or 'job'
    
    Returns:
        tuple: (faiss.Index, list of IDs)
    """
    # If lookback_days is specified, always rebuild (can't cache filtered indexes reliably)
    if lookback_days is not None:
        print(f"Building {model_type} index with {lookback_days}-day lookback (no cache for filtered queries)")
        return build_faiss_index(lookback_days=lookback_days, model_type=model_type)
    
    # Try to load from cache (full index only)
    index_key = f"faiss_index_{model_type}"
    ids_key = f"faiss_{model_type}_ids"
    
    cached_index = cache.get(index_key)
    cached_item_ids = cache.get(ids_key)
    
    if cached_index and cached_item_ids:
        print(f"Loaded FAISS {model_type} index from cache with {len(cached_item_ids)} items")
        index = faiss.deserialize_index(cached_index)
        return index, cached_item_ids
    
    # Rebuild if not in cache
    print(f"FAISS {model_type} index not in cache, rebuilding...")
    return build_faiss_index(lookback_days=None, model_type=model_type)


def add_article_to_index(article):
    """
    Add a single article to the FAISS index.
    
    Args:
        article: Article instance
        
    Returns:
        bool: Success status
    """
    try:
        # Encode the article
        embedding = encode_article(article)
        
        # Load existing index (full index, not filtered)
        index, article_ids = load_faiss_index(lookback_days=None)
        
        if index is None:
            # Create new index if none exists
            index, article_ids = build_faiss_index(lookback_days=None)
        
        # Add new embedding to index
        embedding_array = np.array([embedding]).astype('float32')
        faiss.normalize_L2(embedding_array)
        index.add(embedding_array)
        
        # Update article IDs list
        article_ids.append(article.id)
        
        # Update cache
        _cache_faiss_index(index, article_ids)
        
        print(f"Added article {article.id} to FAISS index")
        return True
        
    except Exception as e:
        print(f"Error adding article to index: {str(e)}")
        return False


def find_similar_articles(article, top_k=5, threshold=None, lookback_days=None):
    """
    Find articles similar to the given article.
    
    Args:
        article: Article instance or text string
        top_k: Number of similar articles to return
        threshold: Similarity threshold (0-1), uses env variable if None
        lookback_days: Number of days to look back. If None, uses default_lookback_days.
                      Set to 0 or False to search all articles.
        
    Returns:
        list: List of tuples (article_id, similarity_score)
    """
    if threshold is None:
        threshold = similarity_threshold
    
    # Handle lookback_days logic
    if lookback_days is None:
        lookback_days = default_lookback_days
    elif lookback_days == 0 or lookback_days is False:
        lookback_days = None  # Search all articles
    
    # Load FAISS index with optional date filtering
    index, article_ids = load_faiss_index(lookback_days=lookback_days)
    
    if index is None or index.ntotal == 0:
        print("No articles in FAISS index")
        return []
    
    # Get embedding for query article
    if isinstance(article, str):
        # If article is a string, encode it directly
        query_embedding = model.encode(article, convert_to_tensor=False, normalize_embeddings=True)
    else:
        # If article is an Article instance
        text = f"{article.title}\n\n{article.excerpt}\n\n{article.content}"
        query_embedding = model.encode(text, convert_to_tensor=False, normalize_embeddings=True)
    
    # Reshape for FAISS
    query_embedding = np.array([query_embedding]).astype('float32')
    faiss.normalize_L2(query_embedding)
    
    # Search for similar articles
    distances, indices = index.search(query_embedding, k=min(top_k + 1, index.ntotal))
    
    # Filter results by threshold and exclude the query article itself
    similar_articles = []
    for idx, distance in zip(indices[0], distances[0]):
        similarity_score = float(distance)  # Cosine similarity (0-1)
        
        if similarity_score >= threshold:
            article_id = article_ids[idx]
            
            # Exclude the query article itself
            if not isinstance(article, str) and article_id == article.id:
                continue
            
            similar_articles.append((article_id, similarity_score))
    
    return similar_articles[:top_k]


def find_similar_jobs(job, top_k=5, threshold=None, lookback_days=None):
    """
    Find jobs similar to the given job.
    
    Args:
        job: Job instance or text string
        top_k: Number of similar jobs to return
        threshold: Similarity threshold (0-1), uses env variable if None
        lookback_days: Number of days to look back. If None, uses default_lookback_days.
                      Set to 0 or False to search all jobs.
        
    Returns:
        list: List of tuples (job_id, similarity_score)
    """
    if threshold is None:
        threshold = similarity_threshold
    
    # Handle lookback_days logic
    if lookback_days is None:
        lookback_days = default_lookback_days
    elif lookback_days == 0 or lookback_days is False:
        lookback_days = None  # Search all jobs
    
    # Check if there are any job embeddings
    if not JobEmbedding.objects.exists():
        print("No job embeddings found in database")
        return []
    
    # Load FAISS index with optional date filtering
    index, job_ids = load_faiss_index(lookback_days=lookback_days, model_type='job')
    
    if index is None or index.ntotal == 0:
        print("No jobs in FAISS index")
        return []
    
    # Get embedding for query job
    if isinstance(job, str):
        # If job is a string, encode it directly
        query_embedding = model.encode(job, convert_to_tensor=False, normalize_embeddings=True)
    else:
        # If job is a Job instance
        text = f"{job.role}\n\n{job.description}"
        query_embedding = model.encode(text, convert_to_tensor=False, normalize_embeddings=True)
    
    # Reshape for FAISS
    query_embedding = np.array([query_embedding]).astype('float32')
    faiss.normalize_L2(query_embedding)
    
    # Search for similar jobs
    distances, indices = index.search(query_embedding, k=min(top_k + 1, index.ntotal))
    
    # Filter results by threshold and exclude the query job itself
    similar_jobs = []
    for idx, distance in zip(indices[0], distances[0]):
        similarity_score = float(distance)  # Cosine similarity (0-1)
        
        if similarity_score >= threshold:
            job_id = job_ids[idx]
            
            # Exclude the query job itself
            if not isinstance(job, str) and job_id == job.id:
                continue
            
            similar_jobs.append((job_id, similarity_score))
    
    return similar_jobs[:top_k]


def check_duplicate(article_text=None, job_text=None, threshold=None, lookback_days=None, model_type='article'):
    """
    Check if an article or job text is a duplicate of existing items.
    
    Args:
        article_text: String containing article content (title + excerpt + content) or dict
        job_text: String containing job content (role + description) or dict
        threshold: Similarity threshold (0-1), uses env variable if None
        lookback_days: Number of days to look back. If None, uses default_lookback_days.
                      Set to 0 or False to search all items.
        model_type: 'article' or 'job'
        
    Returns:
        dict: {
            'is_duplicate': bool,
            'similarity_score': float,
            'similar_item_id': int or None,
            'similar_item': Article/Job instance or None,
            'similar_item_title': str or None
        }
    """
    if threshold is None:
        threshold = similarity_threshold
    
    if model_type == 'article':
        # Handle dict input for articles
        if isinstance(article_text, dict):
            article_text = f"{article_text.get('title', '')}\n\n{article_text.get('excerpt', '')}\n\n{article_text.get('content', '')}"
        
        if not article_text:
            return {
                'is_duplicate': False,
                'similarity_score': 0.0,
                'similar_item_id': None,
                'similar_item': None,
                'similar_item_title': None
            }
        
        similar_articles = find_similar_articles(article_text, top_k=1, threshold=threshold, lookback_days=lookback_days)
        
        if similar_articles:
            article_id, similarity_score = similar_articles[0]
            similar_article = Article.objects.get(id=article_id)
            
            return {
                'is_duplicate': True,
                'similarity_score': similarity_score,
                'similar_item_id': article_id,
                'similar_article_id': article_id,
                'similar_item': similar_article,
                'similar_article': similar_article,
                'similar_item_title': similar_article.title,
                'similar_article_title': similar_article.title
            }
        
        return {
            'is_duplicate': False,
            'similarity_score': 0.0,
            'similar_item_id': None,
            'similar_article_id': None,
            'similar_item': None,
            'similar_article': None,
            'similar_item_title': None,
            'similar_article_title': None
        }
    
    elif model_type == 'job':
        # Handle dict or string input for jobs
        if isinstance(job_text, dict):
            job_text = f"{job_text.get('role', '')}\n\n{job_text.get('description', '')}"
        
        if not job_text:
            return {
                'is_duplicate': False,
                'similarity_score': 0.0,
                'similar_item_id': None,
                'similar_item': None,
                'similar_item_title': None
            }
        
        # Check if there are any jobs to compare against
        if not Job.objects.exists():
            print("No existing jobs to check for duplicates")
            return {
                'is_duplicate': False,
                'similarity_score': 0.0,
                'similar_item_id': None,
                'similar_job_id': None,
                'similar_item': None,
                'similar_job': None,
                'similar_item_title': None,
                'similar_job_role': None
            }
        
        similar_jobs = find_similar_jobs(job_text, top_k=1, threshold=threshold, lookback_days=lookback_days)
        
        if similar_jobs:
            job_id, similarity_score = similar_jobs[0]
            similar_job = Job.objects.get(id=job_id)
            
            return {
                'is_duplicate': True,
                'similarity_score': similarity_score,
                'similar_item_id': job_id,
                'similar_job_id': job_id,
                'similar_item': similar_job,
                'similar_job': similar_job,
                'similar_item_title': similar_job.role,
                'similar_job_role': similar_job.role
            }
        
        return {
            'is_duplicate': False,
            'similarity_score': 0.0,
            'similar_item_id': None,
            'similar_job_id': None,
            'similar_item': None,
            'similar_job': None,
            'similar_item_title': None,
            'similar_job_role': None
        }
    
    else:
        raise ValueError(f"Invalid model_type: {model_type}. Must be 'article' or 'job'")


def rebuild_index():
    """
    Rebuild the entire FAISS index from scratch.
    
    Returns:
        tuple: (faiss.Index, list of article IDs)
    """
    print("Rebuilding FAISS index from scratch...")
    
    # Clear cache
    cache.delete(FAISS_INDEX_CACHE_KEY)
    cache.delete(FAISS_ARTICLE_IDS_CACHE_KEY)
    
    # Rebuild with all articles
    return build_faiss_index(lookback_days=None)


def encode_all_articles():
    """
    Encode all articles that don't have embeddings yet.
    
    Returns:
        int: Number of articles encoded
    """
    # Get articles without embeddings
    articles_without_embeddings = Article.objects.exclude(
        id__in=ArticleEmbedding.objects.values_list('article_id', flat=True)
    )
    
    count = 0
    total = articles_without_embeddings.count()
    
    if total == 0:
        print("All articles already have embeddings")
        return 0
    
    print(f"Encoding {total} articles...")
    
    for article in articles_without_embeddings:
        try:
            encode_article(article)
            count += 1
            if count % 10 == 0:
                print(f"Encoded {count}/{total} articles")
        except Exception as e:
            print(f"Error encoding article {article.id}: {str(e)}")
    
    print(f"Finished encoding {count} articles")
    
    # Rebuild index with new embeddings
    rebuild_index()
    
    return count


def remove_article_from_index(article_id):
    """
    Remove an article from the FAISS index.
    Note: FAISS doesn't support efficient deletion, so this rebuilds the index.
    
    Args:
        article_id: ID of article to remove
        
    Returns:
        bool: Success status
    """
    try:
        # Delete the embedding
        ArticleEmbedding.objects.filter(article_id=article_id).delete()
        
        # Rebuild index
        rebuild_index()
        
        print(f"Removed article {article_id} from index")
        return True
        
    except Exception as e:
        print(f"Error removing article from index: {str(e)}")
        return False


def get_index_stats():
    """
    Get statistics about the FAISS index.
    
    Returns:
        dict: Index statistics
    """
    index, article_ids = load_faiss_index()
    
    total_articles = Article.objects.count()
    indexed_articles = len(article_ids) if article_ids else 0
    articles_with_embeddings = ArticleEmbedding.objects.count()
    
    return {
        'total_articles': total_articles,
        'indexed_articles': indexed_articles,
        'articles_with_embeddings': articles_with_embeddings,
        'unindexed_articles': total_articles - indexed_articles,
        'index_dimension': index.d if index else 0,
        'similarity_threshold': similarity_threshold
    }



if __name__=='__main__':
    # Example usage: encode all articles and build index
    # encode_all_articles()
    content = """
An analysis conducted by The Cable indicates that social media platforms associated with the Indigenous People of Biafra (IPOB) have significantly contributed to the propagation of claims regarding 'Christian genocide' in Nigeria.

According to the report, data collected from X (previously known as Twitter) from January 1 to October 1, 2025, revealed over 165,000 mentions of the topic, reaching approximately 2.83 billion individuals, which is over twelve times the population of Nigeria. Major hashtags used in this discourse included #ChristianGenocide, #LaraLogan, #TruthNigeria, and #BiafraExitNow, with the latter being notably unusual in the conversation.

Confidence MacHarry, a Senior Analyst at SBM Intelligence, pointed out that the narrative of 'Christian genocide' was first promoted by IPOB back in 2016. The analysis highlighted that accounts on X, which support IPOB leader Nnamdi Kanu and advocate for Biafra’s independence, were among the most vocal in disseminating this narrative online.

Furthermore, the report noted that U.S. Senator Ted Cruz, who has recently urged sanctions against Nigeria, has received over $1.8 billion in contributions from AIPAC, a pro-Israel lobbying organization. This finding illustrates the complex interplay of international politics, separatist agendas, and religious discourses in shaping the global perception of Nigeria.

Interest in this debate surged after the Christian Association of Nigeria (CAN) denounced comments made by Presidential advisor Daniel Bwala, accusing him of misinterpreting their stance on the matter during his visit to their headquarters in Abuja.

Ademide Adebayo

Follow us on:

Related News:

Senate Moves to Counter US ‘Christian Genocide’ Label, Says Insecurity Affects All Nigerians

“If I Were Outside, Nobody Can Try This': IPOB Leader Kanu Reads Riot Act to Those…

Daniel Bwala: There Is No Christian Genocide In Nigeria
"""

    result = check_duplicate({'content': content}, lookback_days=0)
    print(result)