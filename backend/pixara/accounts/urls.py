from django.urls import path
from . import views

urlpatterns=[
    path('register/',views.register,name='register'),
    path('login/',views.login,name='login'),
    path('user/profile/',views.profile,name='profile'),
    path('profile/<int:user_id>/',views.user_profile,name='user_profile'),
    path('follow/<int:user_id>/',views.follow_user,name='follow_user'),
    path('resolve-user/<str:username>/', views.resolve_user_id, name='resolve_user_id'),
    path('followers/<int:user_id>/', views.get_followers, name='get_followers'),
    path('following/<int:user_id>/', views.get_following, name='get_following'),
    path('user/<int:user_id>/stats/', views.user_stats, name='user-stats')




]