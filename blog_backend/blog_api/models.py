from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    """
    Django model representing a blog post.
    This model stores blog post data including title, content, author information,
    and timestamps for creation and updates. Posts are ordered by creation date
    in descending order (newest first).
    Attributes:
        title (CharField): The title of the blog post, limited to 200 characters.
        content (TextField): The main content/body of the blog post.
        author (ForeignKey): Reference to the User who created the post.
        created_at (DateTimeField): Timestamp when the post was created (auto-set).
        updated_at (DateTimeField): Timestamp when the post was last modified (auto-updated).
    Properties:
        comments_count (int): Returns the total number of comments on this post.
    Meta:
        ordering: Posts are ordered by creation date in descending order.
    Returns:
        str: The string representation returns the post title.
    """
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def comments_count(self):
        return self.comments.count()

class Comment(models.Model):
    """
    Django model representing a comment on a blog post.
    This model establishes a relationship between users and blog posts through comments,
    allowing users to leave feedback or discussion on published posts.
    Attributes:
        post (ForeignKey): Reference to the Post model that this comment belongs to.
                          On post deletion, all related comments are also deleted.
        author (ForeignKey): Reference to the User model who authored this comment.
                             On user deletion, all their comments are also deleted.
        content (TextField): The actual text content of the comment.
        created_at (DateTimeField): Timestamp when the comment was first created.
                                   Automatically set on creation.
        updated_at (DateTimeField): Timestamp when the comment was last modified.
                                   Automatically updated on each save.
    Meta:
        ordering: Comments are ordered by creation date (oldest first).
    Methods:
        __str__: Returns a string representation showing the comment author and post title.
    Related Names:
        - Accessible from Post model via post.comments
        - Accessible from User model via user.comments
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'