from django.contrib import admin
from .models import Post, Comment

"""
Post Admin Configuration
This class customizes the admin interface for the Post model.
"""
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'created_at', 'updated_at']
    list_filter = ['author', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at']

"""
Comment Admin Configuration
This class customizes the admin interface for the Comment model.
"""
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'author', 'created_at']
    list_filter = ['post', 'author']
    search_fields = ['content']
    readonly_fields = ['created_at']