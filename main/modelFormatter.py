import re

def wikiModelFormatter(model):
    """ Le nom doit correspondre à celui écrit dans la base de données dans les result.index et dans la condition,
    en général il est écrit tout en majuscule et la condition est sensible à la case"""
    result = model.split(" ")
    if "MEGANE" in result:
        result= " ".join(result[0:result.index("MEGANE")]) + " mégane " + " ".join(result[result.index("MEGANE") + 1:])
    elif "SCENIC" in result:
        result=" ".join(result[0:result.index("SCENIC")]) + " scénic " + " ".join(result[result.index("SCENIC") + 1:])
    
    if type(result) == list:
        return " ".join(result)
    else:
        return result

def resultFormatter(model):
    #Si le nom du modèle écrit sur wikipédia est différent d'un mot capitalisé, on le formatte ici.
    result = model.split(" ")
    if "Tt" in result:
        result = " ".join(result[0:result.index("Tt")]) + " TT " + " ".join(result[result.index("Tt") + 1:])
    
    if type(result) == list:
        return " ".join(result)
    else:
        return result
