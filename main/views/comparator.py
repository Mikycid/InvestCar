import json
from json.decoder import JSONDecodeError
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.cache import cache_page
from .views import is_premium, getData
import re
import os

data = getData()

@user_passes_test(lambda x: is_premium(x))
def getModelUrl(request):
    model = request.GET["item"].split(":")[0]
    model = data.query(model, "generation")
    carrosserie = request.GET["item"].split(":")[1]
    etat = request.GET["item"].split(":")[2]
    url = model.marque.iloc[0] + '/' + model.modele.iloc[0] + "/" + model.generation.iloc[0] + "/" + carrosserie + "/" + etat
    return JsonResponse({'url':url})
    

@user_passes_test(lambda x: is_premium(x))
def getModelDatasComparator(request):
    modele_file = request.GET["modele"]
    modele = data.query(" ".join(modele_file.split("_")), "generation")
    url = "/static/frontend/models/" + "_".join(modele.marque.iloc[0].split(" ")) + "/" + "_".join(modele.modele.iloc[0].split(" ")) + "/" + "_".join(modele.generation.iloc[0].split(" "))
    base_url = "frontend/static/frontend/models/" + "_".join(modele.marque.iloc[0].split(" ")) + "/" + "_".join(modele.modele.iloc[0].split(" ")) + "/" + "_".join(modele.generation.iloc[0].split(" "))
    
    graphs = {}
    carr_types = os.listdir(base_url)
    crypted = 0
    for carr_type in carr_types:
        if os.path.isdir(os.path.join(base_url, carr_type)) and not re.match(r"^[protected\-|pdf\-]", carr_type):
            print(carr_type)
            graphs[carr_type] = {}
            states = os.listdir(os.path.join(base_url, carr_type))
            for state in states:
                graphs[carr_type][state] = {}
                mots = os.listdir(os.path.join(base_url, carr_type, state))
                for mot in mots:
                    if not os.path.isfile(os.path.join(base_url, carr_type, state, mot)):
                        graphs[carr_type][state][mot] = os.listdir(os.path.join(base_url,carr_type,state, mot))
        elif re.match(r"^protected\-", carr_type):
            crypted = carr_type
    return JsonResponse({'graphs': graphs})

@user_passes_test(lambda x: is_premium(x))
def addCompareView(request):
    user = User.objects.get(pk=request.user.id)
    try:
        user_views = json.loads(user.profile.vues)
    except JSONDecodeError:
        user_views = {}
    try:
        view_name = request.GET["name"]
    except:
        view_name = "Nouvelle vue"

    if len(user_views.keys()):
        user_views[str(max(list(map(lambda x: int(float(x)),list(user_views.keys())))) + 1)] = {
            'name':view_name,
            'items':[],
        }
    else:
        user_views["0"] = {'name':view_name,
                            'items':[],
                        }
    user.profile.vues = json.dumps(user_views)
    user.save()
    return JsonResponse({'new_view': user_views})

@user_passes_test(lambda x: is_premium(x))
def addItemIntoView(request):
    user = User.objects.get(pk=request.user.id)
    try:
        user_views = json.loads(user.profile.vues)
    except JSONDecodeError:
        user_views = {}
    item = json.loads(request.GET["item"])
    item_name = item["name"].split(":")
    modele = data.query(item_name[0], 'generation')
    if item["type"] == "Prix moyen":
        url = "/static/frontend/models/" + "_".join(modele.marque.iloc[0].split(" ")) + "/" + "_".join(modele.modele.iloc[0].split(" ")) + "/" + "_".join(modele.generation.iloc[0].split(" ")) + "/" + item_name[1] + "/" + item_name[2]
    elif item["type"] == "Régréssion":
        url = "/static/frontend/models/" + "_".join(modele.marque.iloc[0].split(" ")) + "/" + "_".join(modele.modele.iloc[0].split(" ")) + "/" + "_".join(modele.generation.iloc[0].split(" ")) + "/" + item_name[1] + "/" + item_name[2] + "/" + item_name[3]
    elif item["type"] == "Volume (Données)" or item["type"] == "Volume (Transmition)" or item["type"] == "Volume (Énergie)":
        url = "/static/frontend/models/" + "_".join(modele.marque.iloc[0].split(" ")) + "/" + "_".join(modele.modele.iloc[0].split(" ")) + "/" + "_".join(modele.generation.iloc[0].split(" "))
    else:
        url = ""
    item["url"] = url
    user_views[request.GET["vue_id"]]["items"].append(item)
    user.profile.vues = json.dumps(user_views)
    user.save()
    return JsonResponse({'url': url})
    


@user_passes_test(lambda x: is_premium(x))
def getCompareView(request):
    user = User.objects.get(pk=request.user.id)
    try:
        user_views = json.loads(user.profile.vues)
    except JSONDecodeError:
        user_views = []
    try: 
        user_favs = json.loads(user.profile.favorites)
    except JSONDecodeError:
        user_favs = []

    return JsonResponse({'vues':user_views,
                        'favorites': user_favs})

@user_passes_test(lambda x: is_premium(x))
def renameView(request):
    user = User.objects.get(pk=request.user.id)
    try:
        user_views = json.loads(user.profile.vues)
    except JSONDecodeError:
        user_views = []

    user_views[request.GET["view"]]["name"] = request.GET["name"]
    user.profile.vues = json.dumps(user_views)
    user.save()
    return JsonResponse({'new_view': user_views})

@user_passes_test(lambda x: is_premium(x))
def deleteView(request):
    user = User.objects.get(pk=request.user.id)
    try:
        user_views = json.loads(user.profile.vues)
    except JSONDecodeError:
        user_views = []
    
    del user_views[request.GET["view"]]
    user.profile.vues = json.dumps(user_views)
    user.save()
    return JsonResponse({})

@user_passes_test(lambda x: is_premium(x))
def modifyItemPos(request):
    user = User.objects.get(pk=request.user.id)
    try:
        user_views = json.loads(user.profile.vues)
    except:
        user_views = []
    
    item_to_modify = user_views[request.GET["vue"]]["items"][int(request.GET["item"])]
    item_to_modify["pos"] = formatPosition(request.GET["new_pos"])
    user_views[request.GET["vue"]]["items"][int(request.GET["item"])] = item_to_modify
    user.profile.vues = json.dumps(user_views)
    user.save()
    return JsonResponse({})


@user_passes_test(lambda x: is_premium(x))
def deleteItem(request):
    user = User.objects.get(pk=request.user.id)
    try:
        user_views = json.loads(user.profile.vues)
    except:
        user_views = []

    del user_views[request.GET["vue"]]["items"][int(request.GET["item"])]
    user.profile.vues = json.dumps(user_views)
    user.save()
    return JsonResponse({})




@user_passes_test(lambda x: is_premium(x))
@cache_page(60 * 240)
def getMapDatas(request):
    modele = data.query(request.GET["model"], 'generation')
    data_type = request.GET["type"]
    result = []
    if data_type == "Prix moyen par département":
        result = data.meanPriceByZipcodes(modele.modele.iloc[0], modele.marque.iloc[0], gen=modele.generation.iloc[0])
    elif data_type == "Volume par département":
        result = data.zipCodes(modele.modele.iloc[0], modele.marque.iloc[0], gen=modele.generation.iloc[0])
    return JsonResponse({'data':result})

def formatPosition(pos):
    if pos == "0-0":
        return [0,0]
    elif pos == "0-1":
        return [0,1]
    elif pos == "1-0":
        return [1,0]
    elif pos == "1-1":
        return [1,1]


        






