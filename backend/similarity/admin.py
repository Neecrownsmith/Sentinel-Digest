from django.contrib import admin
from .models import ArticleEmbedding

# Register your models here.
@admin.register(ArticleEmbedding)
class ArticleEmbeddingAdmin(admin.ModelAdmin):
    list_display = ('article', 'embedding_vector', 'embedding_created_at')
    search_fields = ('article__title',)