from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorites = models.TextField(default="[]")
    vues = models.TextField(default="\{\}")

    class Meta:
        verbose_name = "Profil"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Buyings(models.Model):
    
    date = models.DateTimeField(default=timezone.now, 
                                verbose_name="Date de parution")
    nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    email = models.EmailField()
    payer_id = models.CharField(max_length=200)
    order_paypal_id = models.CharField(max_length=200)
    item = models.CharField(max_length=500)
    class Meta:
        verbose_name = "Achats"
        ordering = ['date']
    
    


