from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import Post, Like, Comment
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from accounts.models import UserProfile
from .ml_utils import predict_toxicity
from rest_framework.permissions import IsAuthenticated,AllowAny
class PostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def posts(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        paginator = PostPagination()
        page = paginator.paginate_queryset(posts, request)
        if page is not None:
            serializer = PostSerializer(page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def post_detail(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    
    if request.method == 'GET':
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        if post.user != request.user:
            return Response({'error': 'You can only edit your own posts'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = PostSerializer(post, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if post.user != request.user:
            return Response({'error': 'You can only delete your own posts'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_like(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    
    like, created = Like.objects.get_or_create(user=request.user, post=post)
    
    if not created:
        like.delete()
        return Response({'message': 'Post unliked'})
    
    return Response({'message': 'Post liked'})

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def post_comments(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    
    if request.method == 'GET':
        comments = post.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def comment_detail(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    
    if request.method == 'GET':
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        if comment.user != request.user:
            return Response({'error': 'You can only edit your own comments'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if comment.user != request.user:
            return Response({'error': 'You can only delete your own comments'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_posts(request, user_id):
    posts = Post.objects.filter(user_id=user_id)
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def explore_posts(request):
    try:
        # Get users the current user is following
        following_profiles = UserProfile.objects.filter(followers=request.user)
        following_users = [profile.user for profile in following_profiles]

        # Exclude posts from followed users and self
        #posts = Post.objects.exclude(user__in=following_users).exclude(user=request.user)
        posts = Post.objects.all()

        paginator = PostPagination()
        page = paginator.paginate_queryset(posts, request)
        if page is not None:
            serializer = PostSerializer(page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)

        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
@permission_classes([AllowAny])
def classify_comment(request):
    comment = request.data.get('comment', '').strip()
    if not comment:
        return Response({'error': 'Empty comment'}, status=400)

    prediction = predict_toxicity(comment)  # {'toxic': 1, 'obscene': 0, 'insult': 1}

    triggered = [label for label, v in prediction.items() if v == 1]

    return Response({
        'comment': comment,
        'labels': triggered,  
        'scores': prediction  
    })