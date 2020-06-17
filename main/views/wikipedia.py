import wikipedia
from django.http import JsonResponse
from django.views.decorators.cache import cache_page
from .. import modelFormatter
from .views import getData
import requests
from ..formatingMethods import int_to_roman
import re

data = getData()

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

def get_wiki_image(query):
    WIKI_REQUEST = 'http://fr.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles='
    EN_WIKI_REQUEST = 'http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles='
    query = modelFormatter.wikiModelFormatter(query)
    
    search_term = query.split(" ")
    for i in range(len(search_term) - 1):
        search_term[i] = search_term[i].lower().capitalize()
    search_term = " ".join(search_term)
    search_term = modelFormatter.resultFormatter(search_term)
    print(search_term)
    # Looking into EN wikipedia
    try:
        
        wikipedia.set_lang('en')
        wkpage = wikipedia.WikipediaPage(title=search_term)
        title = wkpage.title
        response = requests.get(EN_WIKI_REQUEST+title)
        json_data = response.json()
        img_link = list(json_data['query']['pages'].values())[0]['original']['source']
        return img_link 
    except:
    #EN failed, try FR
        try:
            wikipedia.set_lang('fr')
            wkpage = wikipedia.WikipediaPage(title=search_term)
            title = wkpage.title
            response  = requests.get(WIKI_REQUEST+title)
            json_data = response.json()
            img_link = list(json_data['query']['pages'].values())[0]['original']['source']
            return img_link  
        except:
            #FR failed, try EN with no gen
            search_term = query.split(" ")
            for i in range(len(search_term) - 1):
                search_term[i] = search_term[i].lower().capitalize()
            search_term.pop()
            search_term = " ".join(search_term)
            search_term = modelFormatter.resultFormatter(search_term)
            print(search_term)
            try:
                
                wikipedia.set_lang('en')
                wkpage = wikipedia.WikipediaPage(title=search_term)
                title = wkpage.title
                response  = requests.get(EN_WIKI_REQUEST+title)
                json_data = response.json()
                img_link = list(json_data['query']['pages'].values())[0]['original']['source']
                return img_link  
            #EN with no gen failed, try FR with no gen
            except:
                try:
                    
                    wikipedia.set_lang('fr')
                    wkpage = wikipedia.WikipediaPage(title=search_term)
                    title = wkpage.title
                    response  = requests.get(WIKI_REQUEST+title)
                    json_data = response.json()
                    img_link = list(json_data['query']['pages'].values())[0]['original']['source']
                    return img_link  
                except:  
                    return 0

@cache_page(60*120)
def getMainPageImages(request):
    images = data.markmodeles[0:5]
    images_url = []
    for image in images:
        modele = data.query(image, "generation")
        query = modele.marque.iloc[0] + " " + modele.modele.iloc[0] + " " + int_to_roman(re.search(r"\d+",modele.generation.iloc[0]).group(0))
        images_url.append(get_wiki_image(query))
    return JsonResponse({'images': images_url})