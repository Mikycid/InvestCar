import pandas as pd

df = pd.read_csv('data/liste_modele.csv')

u=""
for i in df["Modèle"] :
    if i!= u :
        print('elif re.match("(.+)?'+i+'(.+)?", model, re.IGNORECASE):'+ '\n \t \t result="'+i+'"')
    u=i


