from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination
from rest_framework.response import Response


class ArticlePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })


class JobPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })


class OverlappingPagination(LimitOffsetPagination):
    """
    Custom pagination that allows fetching more items than the offset increment.
    Useful for preview sections where you want to show upcoming content.
    
    Query params:
    - limit: Number of items to fetch
    - offset: Starting position
    - step: Offset increment per page (defaults to limit if not provided)
    """
    default_limit = 20
    max_limit = 100
    limit_query_param = 'limit'
    offset_query_param = 'offset'
    
    def get_paginated_response(self, data):
        # Calculate step (pagination increment) - can be different from limit
        step = int(self.request.query_params.get('step', self.limit))
        current_offset = self.offset
        
        # Calculate current page number based on step
        current_page = (current_offset // step) + 1 if step > 0 else 1
        
        # Calculate total pages based on step
        total_pages = (self.count + step - 1) // step if step > 0 else 1
        
        return Response({
            'count': self.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': total_pages,
            'current_page': current_page,
            'results': data
        })

