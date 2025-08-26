from django.urls import path
from . import views

"""
URL configuration for the blog API application.
This module defines the URL patterns for the blog API endpoints, including:
Routes:
    - posts/: List all posts or create a new post
    - posts/user/: List posts created by the authenticated user
    - posts/<int:pk>/: Retrieve, update, or delete a specific post by ID
    - posts/<int:post_id>/comments/: List comments for a post or create a new comment
    - search/: Search for posts based on query parameters
    - users/<str:username>/: Retrieve user profile information by username
    - profile/update/: Update the authenticated user's profile
Each URL pattern maps to corresponding view classes or functions in the views module
that handle the HTTP requests and responses for blog operations.
"""
urlpatterns = [
    # Posts
    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/user/', views.UserPostListView.as_view(), name='user-posts'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    
    # Comments
    path('posts/<int:post_id>/comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    
    # Search
    path('search/', views.search_posts, name='search-posts'),
    
    # User Profiles
    path('users/<str:username>/', views.get_user_profile, name='user-profile'),
    path('profile/update/', views.update_user_profile, name='update-profile'),
]