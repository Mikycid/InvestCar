from django.http import JsonResponse
import json
from json.decoder import JSONDecodeError
from django.contrib.auth.models import User

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

def getFavorites(request):
    user = User.objects.get(pk=request.user.id)
    try:
        favs = json.loads(user.profile.favorites)
    except JSONDecodeError:
        favs = []
    return JsonResponse({'favs':favs})