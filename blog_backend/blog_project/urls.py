from django.contrib import admin
from django.urls import path, include

"""
Main URL configuration for the blog project.
This module defines the root URL patterns for the Django blog application,
including routes for:
- Django admin interface
- Authentication API endpoints
- Blog API endpoints
URL Patterns:
    - admin/: Django administration interface
    - api/auth/: User authentication endpoints (login, register, etc.)
    - api/: Blog-related API endpoints (posts, comments, etc.)
"""
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/', include('blog_api.urls')),
]