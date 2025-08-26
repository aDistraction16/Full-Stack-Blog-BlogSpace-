from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Comment

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.

    This serializer handles the serialization and deserialization of User objects,
    exposing only the id, username, and email fields for API responses.

    Attributes:
        Meta.model (Model): The User model this serializer is based on.
        Meta.fields (list): List of fields to include in serialization: 
            ['id', 'username', 'email'].

    Usage:
        Used to convert User model instances to JSON format for API responses
        and to validate incoming user data for API requests.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Comment model instances.
    This serializer handles the serialization and deserialization of Comment objects,
    including nested author information through UserSerializer. The serializer is
    configured to make certain fields read-only to maintain data integrity.
    Fields:
        id (int): Unique identifier for the comment (read-only)
        content (str): The text content of the comment
        author (User): Nested user object representing the comment author (read-only)
        created_at (datetime): Timestamp when the comment was created (read-only)
        updated_at (datetime): Timestamp when the comment was last modified (read-only)
    Note:
        The author field is populated automatically and cannot be modified through
        this serializer. Only the content field can be updated by users.
    """
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for the Post model.
    This serializer handles the serialization and deserialization of Post instances,
    including nested relationships with User (author) and Comment models.
    Fields:
        id (int): Unique identifier for the post (read-only)
        title (str): The title of the post
        content (str): The main content/body of the post
        author (UserSerializer): Nested serializer for the post author (read-only)
        created_at (datetime): Timestamp when the post was created (read-only)
        updated_at (datetime): Timestamp when the post was last updated (read-only)
        comments (CommentSerializer): List of comments associated with the post (read-only)
        comments_count (int): Total number of comments on the post (read-only)
    Note:
        - The author field is automatically set based on the authenticated user
        - Comments are included as nested objects for read operations
        - Comments count provides a quick reference to the total number of comments
        - Created and updated timestamps are automatically managed by the model
    """
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_at', 'updated_at', 'comments', 'comments_count']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']