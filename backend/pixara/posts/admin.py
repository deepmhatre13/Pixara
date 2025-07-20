from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Post, Like, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'caption', 'created_at', 'likes_count', 'comments_count']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'caption']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'post', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'post__caption']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'post', 'content', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'content']
    readonly_fields = ['created_at', 'updated_at']