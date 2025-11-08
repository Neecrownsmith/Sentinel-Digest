from django.db import models
from articles.models import Article

# Create your models here.
class ArticleEmbedding(models.Model):
    article = models.OneToOneField(Article, on_delete=models.CASCADE, unique=True)
    embedding_vector = models.BinaryField()
    embedding_created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Embedding for Article: {self.article.title}"