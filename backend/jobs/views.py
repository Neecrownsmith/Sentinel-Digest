from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Job, Category
from .serializers import JobSerializer, JobListSerializer, JobCategorySerializer


class JobCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for job categories
    """
    queryset = Category.objects.all()
    serializer_class = JobCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class JobViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for jobs with filtering, searching, and pagination
    """
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'status']
    search_fields = ['role', 'description']
    ordering_fields = ['created_at', 'role']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Job.objects.filter(status='published').select_related('category')
        
        # Filter by category if provided
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        return JobSerializer

    @action(detail=False, methods=['get'])
    def by_category(self, request, category_slug=None):
        """
        Get jobs by category slug
        """
        jobs = self.get_queryset().filter(category__slug=category_slug)
        page = self.paginate_queryset(jobs)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured jobs (most recent)
        """
        jobs = self.get_queryset()[:6]
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search jobs by query
        """
        query = request.query_params.get('q', '')
        if not query:
            return Response({'results': []})
        
        jobs = self.get_queryset().filter(
            Q(role__icontains=query) | Q(description__icontains=query)
        )
        
        page = self.paginate_queryset(jobs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(jobs, many=True)
        return Response({'results': serializer.data})