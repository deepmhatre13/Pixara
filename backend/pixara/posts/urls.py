from django.urls import path
from . import views

urlpatterns = [
    path('predict-comment/', views.classify_comment,name='classify_comment'), 
    path('posts/',views.posts,name='posts'),
    path('posts/<int:post_id>/',views.post_detail,name='post_detail'),
    path('posts/<int:post_id>/like/',views.toggle_like,name='toggle_like'),
    path('posts/<int:post_id>/comments/',views.post_comments,name='post_comments'),
    path('posts/user/<int:user_id>/',views.user_posts,name='user_posts'),
    path('posts/explore/',views.explore_posts,name='explore_posts'),
    path('comments/<int:comment_id>/',views.comment_detail,name='comment_detail'),
 
]
