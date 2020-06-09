from django.db import models
from django.utils import timezone
# Create your models here.

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
    
    


