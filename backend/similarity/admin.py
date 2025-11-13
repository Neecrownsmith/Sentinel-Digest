from django.contrib import admin
from .models import ArticleEmbedding, JobEmbedding

# Register your models here.
@admin.register(ArticleEmbedding)
class ArticleEmbeddingAdmin(admin.ModelAdmin):
    list_display = ('article', 'embedding_vector', 'embedding_created_at')
    search_fields = ('article__title',)


@admin.register(JobEmbedding)
class JobEmbeddingAdmin(admin.ModelAdmin):
    list_display = ('job', 'embedding_vector', 'embedding_created_at')
    search_fields = ('job__role',)