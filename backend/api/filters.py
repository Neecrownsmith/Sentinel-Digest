import django_filters
from articles.models import Article


class ArticleFilter(django_filters.FilterSet):
    """Advanced filtering for articles"""
    category = django_filters.CharFilter(field_name='category__slug', lookup_expr='iexact')
    tag = django_filters.CharFilter(field_name='tags__slug', lookup_expr='iexact')
    date_from = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    is_featured = django_filters.BooleanFilter()
    min_views = django_filters.NumberFilter(field_name='view_count', lookup_expr='gte')
    
    class Meta:
        model = Article
        fields = ['category', 'tag', 'date_from', 'date_to', 'is_featured', 'status']
