from rest_framework import serializers
from .models import Job, Category


class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class JobSerializer(serializers.ModelSerializer):
    category = JobCategorySerializer(read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id',
            'role',
            'slug',
            'description',
            'category',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class JobListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    category = JobCategorySerializer(read_only=True)
    excerpt = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id',
            'role',
            'slug',
            'excerpt',
            'category',
            'created_at',
        ]
    
    def get_excerpt(self, obj):
        """Return first 200 characters of description"""
        if obj.description and len(obj.description) > 200:
            return obj.description[:200] + '...'
        return obj.description
