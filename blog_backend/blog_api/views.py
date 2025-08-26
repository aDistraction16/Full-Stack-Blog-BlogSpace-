from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.db.models import Q
from django.core.paginator import Paginator
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer

class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    
    def get_queryset(self):
        return Post.objects.all().order_by('-created_at')
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return []
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """Custom list method to add pagination info"""
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'count': len(serializer.data),
            'total_pages': 1,
            'current_page': 1,
            'has_next': False,
            'has_previous': False
        })

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return []
    
    def get_object(self):
        post = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if post.author != self.request.user:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("You can only edit your own posts.")
        return post

class UserPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        """Custom list method to add pagination info"""
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'count': len(serializer.data),
            'total_pages': 1,
            'current_page': 1,
            'has_next': False,
            'has_previous': False
        })

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).order_by('created_at')
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return []
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        try:
            post = Post.objects.get(id=post_id)
            serializer.save(author=self.request.user, post=post)
        except Post.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Post not found")

@api_view(['GET'])
def search_posts(request):
    """Search posts by title and content"""
    query = request.GET.get('q', '').strip()
    
    if not query:
        return Response({'results': [], 'count': 0})
    
    posts = Post.objects.filter(
        Q(title__icontains=query) | Q(content__icontains=query)
    ).order_by('-created_at')
    
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    serializer = PostSerializer(page_obj, many=True)
    
    return Response({
        'results': serializer.data,
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
        'query': query
    })

@api_view(['GET'])
def get_user_profile(request, username):
    """Get user profile with their posts"""
    try:
        user = User.objects.get(username=username)
        posts = Post.objects.filter(author=user).order_by('-created_at')
        
        paginator = Paginator(posts, 10)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)
        
        posts_serializer = PostSerializer(page_obj, many=True)
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email if request.user == user else None,
                'date_joined': user.date_joined,
                'posts_count': posts.count()
            },
            'posts': {
                'results': posts_serializer.data,
                'count': paginator.count,
                'total_pages': paginator.num_pages,
                'current_page': page_obj.number,
                'has_next': page_obj.has_next(),
                'has_previous': page_obj.has_previous()
            }
        })
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update user profile"""
    user = request.user
    email = request.data.get('email')
    
    if email:
        if User.objects.filter(email=email).exclude(id=user.id).exists():
            return Response(
                {'error': 'Email already taken'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        user.email = email
        user.save()
    
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined
        }
    })