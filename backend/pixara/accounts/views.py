from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from .models import User, UserProfile
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer
)
from accounts.models import UserProfile

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        profile, _ = UserProfile.objects.get_or_create(user=user)
        user_data = UserSerializer(user).data
        profile_data = UserProfileSerializer(profile).data
        profile_data['followers_count'] = profile.followers.count()
        profile_data['following_count'] = UserProfile.objects.filter(followers=user).count()
        return Response({
            'user': user_data,
            'profile': profile_data
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def follow_user(request, user_id):
    try:
        # Get the user to follow
        user_to_follow = User.objects.get(id=user_id)

        # Prevent self-follow
        if request.user == user_to_follow:
            return Response({'error': 'You cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create profiles
        profile_to_follow, _ = UserProfile.objects.get_or_create(user=user_to_follow)
        current_user_profile, _ = UserProfile.objects.get_or_create(user=request.user)

        # Toggle follow/unfollow
        if profile_to_follow.followers.filter(id=request.user.id).exists():
            profile_to_follow.followers.remove(request.user)
            profile_to_follow.save()
            return Response({'message': 'Unfollowed successfully'})
        else:
            profile_to_follow.followers.add(request.user)
            profile_to_follow.save()
            return Response({'message': 'Followed successfully'})

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_followers(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        profile = UserProfile.objects.get(user=user)
        followers = profile.followers.all()
        return Response({'followers': UserSerializer(followers, many=True).data})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    

    
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def resolve_user_id(request, username):
    try:
        user = User.objects.get(username=username)
        return Response({'id': user.id})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)




@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_following(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        following_profiles = UserProfile.objects.filter(followers=user)
        following_users = [p.user for p in following_profiles]
        return Response({'following': UserSerializer(following_users, many=True).data})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        profile, _ = UserProfile.objects.get_or_create(user=user)

        followers_count = profile.followers.count()
        following_count = UserProfile.objects.filter(followers=user).count()

        return Response({
            'followers': followers_count,
            'following': following_count
        })

    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)

