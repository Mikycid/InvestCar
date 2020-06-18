from django.http import JsonResponse
import json
from json.decoder import JSONDecodeError
from django.contrib.auth.models import User
from .views import getData
from django.contrib.auth import authenticate, login, logout
from cryptography.fernet import Fernet
from django.core import serializers

data = getData()

def addToFavorites(request):
    user = User.objects.get(pk=request.user.id)
    try:
        favs = json.loads(user.profile.favorites)
    except JSONDecodeError:
        favs = []
    if request.GET["item"] not in favs:
        favs.append(request.GET["item"])
        user.profile.favorites = json.dumps(favs)
        user.save()
    return JsonResponse({})

def removeFromFavorites(request):
    user = User.objects.get(pk=request.user.id)
    try:
        favs = json.loads(user.profile.favorites)
    except JSONDecodeError:
        favs = []
    del favs[favs.index(request.GET["model"])]
    user.profile.favorites = json.dumps(favs)
    user.save()
    return JsonResponse({})

def getFavorites(request):
    user = User.objects.get(pk=request.user.id)
    try:
        favs = json.loads(user.profile.favorites)
    except JSONDecodeError:
        favs = []
    return JsonResponse({'favs':favs})

def isFav(request):
    user = User.objects.get(pk=request.user.id)
    try:
        favs = json.loads(user.profile.favorites)
    except JSONDecodeError:
        favs = []
    
    modele = data.query(request.GET["model"], column='generation')
    if modele.marque.iloc[0] + " " + modele.modele.iloc[0] +  " " + modele.generation.iloc[0] not in favs:
        is_fav = False
    else:
        is_fav = True
    return JsonResponse({'is_fav': is_fav})


def connexion(request):
    error = False
    username = request.GET["username"]
    password = request.GET["password"]
    user = authenticate(username=username,
         password=Fernet(b"GkHf0-y9IMYoiGsTbUfVj1wtBtolEMLuK2awH9WEu5Y=").decrypt(password.encode()))
    if user is not None:
        email = user.email
        if user.is_superuser:
            group = ["admin"]
        else: 
            group = serializers.serialize('json',user.groups.all())
        if user:
            login(request, user)
        else: 
            error = True
        if error:
            return JsonResponse({'error': error})
        else:
            return JsonResponse({'error': error, 'username': username, 'email': email, 'group': group})
    else:
        return JsonResponse({'error': True})



def inscription(request):
    error = False
    try:
        username = request.GET["username"]
        password = request.GET["password"]
        email = request.GET["email"]
        user = User.objects.create_user(username, email, password)
        user.groups.set(["Basic user"])
        user.save()
    except:
        error = True
    
    return JsonResponse({'error': error})
    
def deconnexion(request):
    logout(request)
    return JsonResponse({'error': False})