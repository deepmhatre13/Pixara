from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User,UserProfile

@receiver(post_save,sender=User)
def create_user_profile(sender,instance,created,**kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save,sender=User)
def save_user_profile(sender,instance,**kwargs):
    try:
        instance.userprofile.save()
    except UserProfile.DoesNotExist:
        pass