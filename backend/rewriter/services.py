import os
from dotenv import load_dotenv
import openai
import json
import sys
import django
import uuid
import uuid
# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from scraper.services import get_latest_urls, scrape_article
from articles.models import Article, Category, Tag, Image
from scraper.models import ScrapedArticle
from rewriter.models import Log
from core.template import get_failed_rewriter_template
from core.utils import EmailService
from django.utils import timezone
from social_media.services import SocialMediaService
from similarity.checker import check_duplicate

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = os.getenv("OPENAI_MODEL")

system_prompt = """
You are an advanced Nigeria based AI system designed to rephrase full-length news articles for republication. Your primary goal is to rewrite the article using original wording while preserving its factual meaning, structure, and readability. Do NOT summarize the article — instead, rephrase it thoroughly at the sentence and paragraph level to ensure it is legally distinct from the source.

You will output your results in **strict JSON format**, with the following fields:

---

**Required Output Format (JSON):**

{
  "title": "Rephrased Title Here",
  "excerpt": "This is a brief summary of the article's main points...",
  "category": "Category the article falls into in strictly one of [Politics, Business, Technology, Health, Education, Entertainment, Sports, International, Opinion]",
  "tags": ["tag1", "tag2", "tag3"],
  "content": "Here is the newly rephrased body of the article...",
  "approximate_reading_time": "390",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "alt_text": "Description of the image"
    }
  ],
  "twitter": ,
}

---

**Field Descriptions & Guidelines:**

- **Title**: Rephrase the original headline using different wording while preserving the intent. Keep it clear, concise, and relevant.
  
- **Excerpt**: Write a short paragraph (1–3 sentences) summarizing the core message or key event of the article.

- **Category**: Choose one strictly from the following predefined options to classify the article: Politics, Business, Technology, Health, Education, Entertainment, Sports, International, Opinion.    

- **Tags**: List 3–7 relevant keywords or phrases related to the topic (e.g., “AI, Machine Learning, ChatGPT”).

- **Content**: Rephrase the full article body. Retain the original paragraph structure and information hierarchy, but rewrite every sentence with fresh language and phrasing to ensure originality. Do **not** omit or merge content unless explicitly instructed. and make sure each paragraph is separated by new line.

- **Approximate Reading Time**: Calculate based on average reading speed (200–250 words per minute), and return the value in **seconds**.

- **Images**: Include any image URLs from the source (if provided), along with a short alt-text description.

---

**General Guidelines:**

- **Legal Distinction**: Ensure the output is substantially different from the source to avoid copyright infringement. Paraphrase all text — do not copy phrases or sentence structures verbatim.

- **Tone**: Maintain a **neutral, informative** tone appropriate for journalistic content.

- **Accuracy**: Preserve all factual information, including names, locations, figures, and dates. If uncertain, retain the original phrasing or flag for review.

- **Formatting**: Output must be valid JSON, formatted with double quotes and proper structure for easy machine parsing.

---

If any input content is incomplete or corrupted, return an error message in this format:
```json
{
  "error": "Invalid or incomplete article input."
}

"""


def generate_user_prompt(container):
    user_prompt = "This is the html content of the news article to be rephrased."
    user_prompt += container
    return user_prompt


def process_article(container):
    user_prompt = generate_user_prompt(container)
    client = openai.Client(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format={"type": "json_object"}  # Correct parameter name
    )

    # Access the response content
    content = response.choices[0].message.content
    result = json.loads(content)
    
    # Add token usage info to result
    if hasattr(response, 'usage'):
        result['_token_usage'] = {
            'prompt_tokens': response.usage.prompt_tokens,
            'completion_tokens': response.usage.completion_tokens,
            'total_tokens': response.usage.total_tokens
        }
    
    return result

def check_if_duplicate(result):
    result = check_duplicate({'content': result.get("content", "")}, lookback_days=3)
    return result


if __name__ == "__main__":
    
    
    # Create log entry with unique ID
    log_id = f"log-{timezone.now().strftime('%Y%m%d-%H%M%S')}-{str(uuid.uuid4())[:8]}"
    log = Log.objects.create(log_id=log_id, status='running')
    
    # Tracking variables
    successful_count = 0
    failed_count = 0
    skipped_count = 0
    duplicate_count = 0  # Track duplicates separately
    total_tokens = 0
    new_categories = 0
    new_tags = 0
    total_images = 0
    
    try:
        urls = get_latest_urls()
        log.new_url_count = len(urls)
        log.save()
        
        print(f"\n{'='*70}")
        print(f"Starting rewriter process for {len(urls)} articles")
        print(f"Log ID: {log.log_id}")
        print(f"{'='*70}\n")
        
        for index, url in enumerate(urls, 1):
            print(f"\n[{index}/{len(urls)}] Processing: {url}")
            
            try:
                # Check if article already exists
                if Article.objects.filter(original_from__url=url).exists():
                    print(f"Article already processed!")
                    skipped_count += 1
                    continue
                
                container = scrape_article(url)
                if not container:
                    print(f"Failed to scrape article!")
                    failed_count += 1
                    continue

                
                # Process with AI
                result = process_article(container)

                duplicate_check = check_if_duplicate(result)

                if duplicate_check['is_duplicate']:
                    print(f"DUPLICATE DETECTED!")
                    print(f"Similarity: {duplicate_check['similarity_score']:.2%}")
                    print(f"Similar to: {duplicate_check['similar_article_title']}")
                    
                    # Increment publication_count for the similar article
                    similar_article = duplicate_check['similar_article']
                    
                    # Check if publication_count field exists
                    if hasattr(similar_article, 'publication_count'):
                        similar_article.publication_count += 1
                        similar_article.save(update_fields=['publication_count'])
                        print(f"Incremented publication_count to {similar_article.publication_count}")
                    else:
                        print(f"Warning: Article model doesn't have 'publication_count' field")
                    
                    # Create ScrapedArticle entry to mark as processed
                    ScrapedArticle.objects.get_or_create(url=url)
                    
                    duplicate_count += 1
                    continue
                
                # Track tokens
                if '_token_usage' in result:
                    total_tokens += result['_token_usage']['total_tokens']
                
                # Get or create category
                category_name = result.get("category", "News")
                category_name = category_name if category_name.lower() in ["politics", "business", "technology", "health", "education", "entertainment", "sports", "international", "opinion"] else "News"
                category, created = Category.objects.get_or_create(name=category_name)
                if created:
                    new_categories += 1
                
                # Get or create ScrapedArticle instance
                scraped_article, _ = ScrapedArticle.objects.get_or_create(url=url)
                
                # Create article
                article = Article.objects.create(
                    title=result.get("title", ""),
                    excerpt=result.get("excerpt", ""),
                    content=result.get("content", ""),
                    category=category,
                    reading_time_seconds=int(result.get("approximate_reading_time", 0)),
                    original_from=scraped_article
                )
                
                # Add tags
                tag_names = result.get("tags", [])
                for tag_name in tag_names:
                    tag, created = Tag.objects.get_or_create(name=tag_name)
                    if created:
                        new_tags += 1
                    article.tags.add(tag)
                
                # Save images
                image_urls = result.get("images", [])
                for img_index, img_dict in enumerate(image_urls):
                    Image.objects.create(
                        article=article,
                        url=img_dict.get("url", ""),
                        alt_text=img_dict.get("alt_text", ""),
                        order=img_index
                    )
                    total_images += 1
                
                successful_count += 1
                print(f"✓ Saved: {article.title}")
                print(f"  Category: {category.name} | Tags: {len(tag_names)} | Images: {len(image_urls)}")

                # Auto-post to social media
                SocialMediaService.create_social_posts(article)
                
            except Exception as e:
                failed_count += 1
                print(f"✗ Failed to process article: {str(e)}")
                if not log.error_message:
                    log.error_message = f"First error at {url}: {str(e)}"
                else:
                    log.error_message += f"\n{url}: {str(e)}"
                log.save()

            
            
            # break  # Remove or comment this line to process all articles
        
        # Update log with final stats
        log.end_time = timezone.now()
        log.total_urls_processed = len(urls)
        log.successful_articles = successful_count
        log.failed_articles = failed_count
        log.skipped_articles = skipped_count + duplicate_count  # Include duplicates in skipped
        log.new_categories_created = new_categories
        log.new_tags_created = new_tags
        log.total_images_saved = total_images
        log.total_tokens_used = total_tokens
        
        # Add duplicate info to log
        if duplicate_count > 0:
            dup_msg = f"\n{duplicate_count} duplicate articles detected (publication_count incremented)"
            log.error_message = (log.error_message or "") + dup_msg
        
        # Determine final status
        if successful_count == len(urls):
            log.status = 'completed'
        elif successful_count > 0:
            log.status = 'partial'
        else:
            log.status = 'failed'
        
        log.calculate_duration()
        log.save()
        
        print(f"\n{'='*70}")
        print(f"Rewriter process completed. Log ID: {log.log_id}")
        print(f"Status: {log.status.upper()}")
        print(f"{'='*70}")
        print(f"Successful: {successful_count}")
        print(f"Failed: {failed_count}")
        print(f"Skipped: {skipped_count}")
        print(f"Duplicates: {duplicate_count}")
        print(f"Time taken: {log.time_taken}s")
        print(f"{'='*70}\n")

    except Exception as e:
        # Handle catastrophic failure
        log.end_time = timezone.now()
        log.status = 'failed'
        log.error_message = f"Critical error: {str(e)}"
        log.calculate_duration()
        log.save()

        message = get_failed_rewriter_template(log.log_id, e)
        EmailService.send_email_to_admins(message, subject=f"Rewriter Failed: Log {log.log_id}", is_html=True)