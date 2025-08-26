from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

"""
Authentication URL Configuration
This module defines URL patterns for user authentication endpoints in the blog application.
URL Patterns:
    - register/ : User registration endpoint that handles new user account creation
    - login/ : User login endpoint that authenticates users and returns JWT tokens
    - token/refresh/ : JWT token refresh endpoint that provides new access tokens using refresh tokens
All authentication endpoints use JWT (JSON Web Tokens) for secure user authentication
and session management.
"""
urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]