from django.http import JsonResponse
from . import Data
from . import modelFormatter
from django.core import serializers
from math import ceil
import os
import json
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import user_passes_test
from django.contrib.admin.views.decorators import staff_member_required
from django.core.mail import send_mail, EmailMessage
import pandas as pd
import requests
import re
from django.views.decorators.cache import cache_page
import wikipedia
from cryptography.fernet import Fernet
from main.models import Buyings

data = Data.DataMachine()
data.start()

def is_premium(user):
    return user.groups.filter(name='Premium').exists() or user.is_superuser

def askIfPremium(request):
    print(request.user.username)
    print(is_premium(request.user))
    return JsonResponse({'is_premium' :is_premium(request.user)})

def getUser(request):
    if request.user.is_authenticated:
        if request.user.is_superuser:
            group = ["admin"]
        else: 
            group = serializers.serialize('json',request.user.groups.all())
        return JsonResponse({
            'username': request.user.username,
            'password': Fernet(b"GkHf0-y9IMYoiGsTbUfVj1wtBtolEMLuK2awH9WEu5Y=").encrypt(request.user.password.encode()).decode('utf-8'),
            'email': request.user.email,
            'group': group,
            'error': False
        })
    else:
        return JsonResponse({'error': True})

def isUserLoggedIn(request):
    if request.user.is_authenticated:
        return JsonResponse({'isLoggedIn': True})
    else:
        return JsonResponse({'isLoggedIn': False})
        
def getEncryptedPdf(request):
    return JsonResponse({'crypted': data.encrypted_pdf})

def registerCommand(request):
    body_unicode = request.body.decode('utf-8')
    datas = json.loads(body_unicode)
    email = datas["data"]["payer"]["email_address"]
    prenom = datas["data"]["payer"]["name"]["given_name"]
    nom = datas["data"]["payer"]["name"]["surname"]
    payer_id = datas["data"]["payer"]["payer_id"]
    order_id = datas["data"]["id"]
    order = Buyings()
    order.nom = nom
    order.prenom = prenom
    order.payer_id = payer_id
    order.order_paypal_id = order_id
    order.email = email
    order.item = datas["item"]
    order.save()
    email_msg = EmailMessage('Votre fichier PDF est disponible dans ce message',
                            'Nous vous remercions d\'avoir acheté ce document.',
                            'sales@investcar.fr',
                            [email])
    email_msg.attach_file(os.path.join(data.getItemDir(datas["item"][:-4]),datas["item"]))
    email_msg.send()
    
    return JsonResponse({'error': False})

@cache_page(60*120)
def modelList(request):
    page = int(request.GET["page"])
    return JsonResponse({
            'modeles':data.markmodeles[(page - 1) *9:(page - 1) * 9 + 9],
            'page_nb': ceil(len(data.markmodeles) / 9),
            'motors': data.motors_end[(page - 1) *9:(page - 1) * 9 + 9],
        })

@cache_page(60*120)
def modelView(request):
    modele = request.GET["modele"]
    modele = data.query(" ".join(modele.split("_")), "modele")
    return JsonResponse({
        'gens': list(modele.generation.drop_duplicates()),
    })

@cache_page(60*15)
def query(request):
    if request.GET["modele"] == "*":
        all_models_from_mark = data.query(request.GET["marque"], column="marque")
        modeles = list(all_models_from_mark.modele.drop_duplicates())
        return JsonResponse({'modeles':modeles})

    marques = data.query(request.GET["modele"], "marque").marque.drop_duplicates()
    query_modeles = data.query(request.GET["modele"], "modele")
    modeles =  query_modeles.marque + " " + query_modeles.modele
    modeles = modeles.drop_duplicates()
    generations = data.query(request.GET["modele"], "generation")
    generations = generations.marque + " " + generations.modele + " " + generations.generation
    generations = generations.drop_duplicates()
    return JsonResponse({
        'marques': list(marques),
        'modeles': list(modeles),
        'generations': list(generations)
    })

@cache_page(60*120)
def genView(request):
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
        
    if is_premium(request.user):
        zipcodes = data.zipCodes(modele.modele.iloc[0], modele.marque.iloc[0], gen=modele.generation.iloc[0])
    else:
        zipcodes = []

    mean_price_by_zipcodes = data.meanPriceByZipcodes(modele.modele.iloc[0], modele.marque.iloc[0], gen=modele.generation.iloc[0])
    
    this_volume = len(modele.generation)
    
    
    return JsonResponse({'graphs':graphs,
                         'zipcodes':zipcodes,
                         'meanprice':mean_price_by_zipcodes,
                         'url': url, 'max_volume':data.max_model_entries, 
                         'this_volume': this_volume, 
                         'modele':modele.modele.iloc[0],
                         'marque':modele.marque.iloc[0],
                         'generation':modele.generation.iloc[0],
                         'crypted': crypted,
                         })

@cache_page(60*60*48)
def getImage(request):
    modele = request.GET["modele"]
    marque = request.GET["marque"]
    if marque == "true":
        image = get_wiki_image(modele)
        return JsonResponse({'image':image})
    else:
        modele = data.query(" ".join(modele.split("_")), "generation")
        query = modele.marque.iloc[0] + " " + modele.modele.iloc[0] + " " + int_to_roman(re.search(r"\d+",modele.generation.iloc[0]).group(0))
        
        image = get_wiki_image(query)
        return JsonResponse({'image':image})


@cache_page(60*120)
def bestPercentages(request):
    
    results = {
        "models": data.markmodeles[0:5],
        "percentages": data.percentages[0:5],
    }
    return JsonResponse(results)

@cache_page(60*120)
def getMainPageImages(request):
    images = data.markmodeles[0:5]
    images_url = []
    for image in images:
        modele = data.query(image, "generation")
        query = modele.marque.iloc[0] + " " + modele.modele.iloc[0] + " " + int_to_roman(re.search(r"\d+",modele.generation.iloc[0]).group(0))
        images_url.append(get_wiki_image(query))
    return JsonResponse({'images': images_url})

@cache_page(60*120)
def filterZipCodes(request):
    modele = request.GET["modele"]
    modele = data.query(" ".join(modele.split("_")), "generation")
    filtre_carr = " ".join(request.GET["car"].split("_"))
    if is_premium(request.user):
        zipcodes = data.zipCodes(modele.modele.iloc[0], modele.marque.iloc[0], car=filtre_carr)
    else:
        zipcodes = []
    mean_price_by_zipcodes = data.meanPriceByZipcodes(modele.modele.iloc[0], modele.marque.iloc[0], car=filtre_carr)
    print(mean_price_by_zipcodes)
    return JsonResponse({'zipcodes':zipcodes,'meanprice':mean_price_by_zipcodes})

@cache_page(60*120)
def getMainPercentages(request):
    modele = request.GET["modele"]
    modele = data.query(" ".join(modele.split("_")), "generation")
    percentage_3_months = data.percentageVartiation(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0], days_variation=90)
    percentage_6_months = data.percentageVartiation(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0], days_variation=180)
    percentage_1_year = data.percentageVartiation(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0], days_variation=365)
    return JsonResponse({'percentage1': percentage_3_months, 'percentage2': percentage_6_months, 'percentage3': percentage_1_year})

@user_passes_test(lambda x: x.is_superuser or is_premium(x))
def getPercentageVartation(request):
    days_variation = request.GET["days"]
    modele = request.GET["modele"]
    modele = data.query(" ".join(modele.split("_")), "generation")
    percentage = data.percentageVartiation(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0], days_variation=int(days_variation))

    return JsonResponse({'percentage': percentage})


@cache_page(60*120)
def getModelInfos(request):
    modele = request.GET["modele"]
    modele = data.query(" ".join(modele.split("_")), "generation")
    modele["marque"] = modele["marque"].apply(lambda x: x.replace("slashcharacter001", "/"))
    modele["modele"] = modele["modele"].apply(lambda x: x.replace("slashcharacter001", "/"))
    modele["generation"] = modele["generation"].apply(lambda x: x.replace("slashcharacter001", "/"))
    motors = data.prototype_data.getAllMotors(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    series = data.prototype_data.getAllSeries(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    years = data.prototype_data.getTimeStamp(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    energy = data.prototype_data.getEnergyType(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    couple = data.prototype_data.getCouple(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    cylindres = data.prototype_data.getNbCylindre(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    turbo = data.prototype_data.isTurbo(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    vmax = data.prototype_data.getVMax(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    zero_to_hundred = data.prototype_data.getZeroHundred(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    injection = data.prototype_data.getInjection(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    urban_conso = data.prototype_data.getUrbanConso(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    extra_urban_conso = data.prototype_data.getExtraUrbanConso(modele.marque.iloc[0], modele.modele.iloc[0], modele.generation.iloc[0])
    
    return JsonResponse({'motors': motors,
                         'series': series,
                         'years': years,
                         'energy': energy,
                         'couple':couple,
                         'cylindres': cylindres,
                         'turbo': turbo,
                         'vmax': vmax,
                         'zero_to_hundred': zero_to_hundred,
                         'injection': injection,
                         'urban_conso': urban_conso,
                         'extra_urban_conso': extra_urban_conso,
                         })

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
        

@user_passes_test(lambda x: x.is_superuser)
@staff_member_required
def manageDatabase(request):
    datas = request.GET["datas"].split(",")
    if datas[3] == "":
        datas[3] = data.prototype_data.classify_gen(datas[1],datas[0],datas[5], datas[-2], datas[-1], datas[7], datas[9])[0]
    if datas[4] == "":
        datas[4] = data.prototype_data.classify_car(datas[1], datas[0], datas[5], datas[-2], [datas[3]], datas[-1], datas[7], datas[9])[0]
    if type(datas[3]) == list:
        datas[3] = datas[3][0]
    if type(datas[4]) == list:
        datas[4] = datas[4][0]
    datas.pop()
    errors = data.addNewLine(datas)
    return JsonResponse({'errors': errors})

def sendFileDatas(request):
    datas = request.FILES["file-input"]
    data.addNewCsv(datas)
    return JsonResponse({})

def get_wiki_image(query):
    WIKI_REQUEST = 'http://fr.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles='
    query = modelFormatter.wikiModelFormatter(query)
    
    search_term = query.split(" ")
    for i in range(len(search_term) - 1):
        search_term[i] = search_term[i].lower().capitalize()
    print(" ".join(search_term))
    try:
        search_term = " ".join(search_term)
        wikipedia.set_lang('fr')
        wkpage = wikipedia.WikipediaPage(title = search_term)
        title = wkpage.title
        response  = requests.get(WIKI_REQUEST+title)
        json_data = response.json()
        img_link = list(json_data['query']['pages'].values())[0]['original']['source']
        return img_link        
    except:
        search_term = query.split(" ")
        for i in range(len(search_term) - 1):
            search_term[i] = search_term[i].lower().capitalize()
        search_term.pop()
        search_term = " ".join(search_term)
        try:
            
            wikipedia.set_lang('fr')
            wkpage = wikipedia.WikipediaPage(title = search_term)
            title = wkpage.title
            response  = requests.get(WIKI_REQUEST+title)
            json_data = response.json()
            img_link = list(json_data['query']['pages'].values())[0]['original']['source']
            return img_link      
        except:  
            return 0



def int_to_roman(nb):
    res = ''
    nb = int(nb)
    if nb >= 50:
        res += 'L'
        nb -= 50
     
    while nb >= 10:
        res += 'X'
        nb -= 10
     
    if nb == 9:
        res += 'IX'
        nb -= 9
 
    if nb >= 5:
        res += 'V'
        nb -= 5
 
    if nb == 4:
        res += 'IV'
        nb -= 4
 
    while nb > 0:
        res += 'I'
        nb -= 1
 
    return res
    