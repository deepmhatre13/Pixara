from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Post, Like, Comment

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'user', 'content', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.ReadOnlyField()
    comments_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = ('id', 'user', 'caption', 'image', 'created_at', 'updated_at', 
                 'likes_count', 'comments_count', 'is_liked', 'comments')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_user(self, obj):
        return UserSerializer(obj.user, context=self.context).data
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, post=obj).exists()
        return False

class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Like
        fields = ('id', 'user', 'created_at')
        read_only_fields = ('id', 'created_at')