#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Apr 12 21:00:13 2020

@author: mike
"""

import matplotlib.pyplot as plt
import pandas as pd
import statistics as st
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder
import datetime
import re


df = pd.read_csv('../la_centrale_df.csv')
#df2 = df.drop(["position", "cylindree_cm3", "couple_Nm", "type_de_suralimentation", "boite_de_vitesse_nb_de_rapports", "marque","id", "type_carrosserie", "date_de_commercialisation", "date_de_fin_de_commercialisation", "duree_de_la_garantie_en_annee", "intervalles_de_revision_km","intervalles_de_revision_maxi_en_mois", "longueur_en_metre", "largeur_sans_retros_en_metre","hauteur_en_metre","empattement_en_metre","volume_de_coffre_mini_maxi_en_litre","volume_de_coffre_mini_en_litre","volume_de_coffre_maxi_en_litre","nombre_de_portes","nombre_de_places_assises"], axis=1)
#df = df[(df.puissance_fiscale_cv != "NC") & (df.annee.notna()) & (df.gamme.notna()) & (carburant.notna())]
  

def plotVolume():
    df_sorted = df[(df["marque"] == "RENAULT") & (df["modele"] == "CLIO")]
    df_sorted.date = pd.to_datetime(df_sorted.date, dayfirst=True)
    
    
    
    dict_volume = {}
    for i in range(len(df_sorted.date)):
        if str(df_sorted.date.iloc[i].year) + "-" + str(df_sorted.date.iloc[i].month) in dict_volume:
            dict_volume[str(df_sorted.date.iloc[i].year) + "-" + str(df_sorted.date.iloc[i].month)] += 1
            
        else:
            dict_volume[str(df_sorted.date.iloc[i].year) + "-" + str(df_sorted.date.iloc[i].month)] = 1
    
    dates = pd.DataFrame(list(zip(dict_volume.keys(), dict_volume.values())), columns=["dates","volume"])
    dates["dates"] = pd.to_numeric(pd.to_datetime(dates["dates"]))
    
    human_dates = pd.to_datetime(dates["dates"])
    plt.plot(human_dates, dates["volume"])
    
               
    


def meanPriceByMonth():
    if len(df):
        df_sorted = df[(df["prix"] != "NC") & (df["prix"].notna()) & (df["modele"] == "CLIO") & (df["generation"] == "4 génération")]
        df_sorted.date = pd.to_datetime(df_sorted.date, dayfirst=True)
        all_cv = df_sorted.drop_duplicates(subset="chevaux_din")
        list_cv = []
        csv_df = pd.DataFrame()
        max_dates = []
        for cv in all_cv["chevaux_din"]:
            df_by_cv = df_sorted[df_sorted["chevaux_din"] == cv]
            if len(df_by_cv):
                df_by_cv = df_by_cv.sort_values("date")
                dict_price = {}
                dict_price[str(cv)] = {}
                number = {}
                number[str(cv)] = {}
                for i in range(len(df_by_cv.date)):
                    if str(df_by_cv.date.iloc[i].year) + "-" + str(df_by_cv.date.iloc[i].month) in dict_price[str(cv)]:
                        dict_price[str(cv)][str(df_by_cv.date.iloc[i].year) + "-" + str(df_by_cv.date.iloc[i].month)] += int(df_by_cv.prix.iloc[i])
                        number[str(cv)][str(df_by_cv.date.iloc[i].year) + "-" + str(df_by_cv.date.iloc[i].month)] += 1
                    else:
                        dict_price[str(cv)][str(df_by_cv.date.iloc[i].year) + "-" + str(df_by_cv.date.iloc[i].month)] = int(df_by_cv.prix.iloc[i])
                        number[str(cv)][str(df_by_cv.date.iloc[i].year) + "-" + str(df_by_cv.date.iloc[i].month)] = 1
                for i in dict_price[str(cv)]:
                    dict_price[str(cv)][i] /= number[str(cv)][i]
                
                dates = pd.DataFrame(list(zip(dict_price[str(cv)].keys(), dict_price[str(cv)].values())), columns=["dates","prix"])
                dates["dates"] = pd.to_numeric(pd.to_datetime(dates["dates"]))
                
                human_dates = pd.to_datetime(dates["dates"])
                if len(human_dates) > len(max_dates):
                    max_dates = human_dates
                plt.plot(human_dates, dates["prix"])
                list_cv.append(str(cv) + " cv")
                csv_df.columns.append(pd.Index([str(cv) + " cv"]))
                
                for i in range(len(dates)):
                    csv_df.loc[i, str(cv) + " cv"] = dates.iloc[i].prix
        csv_df.index = max_dates 
        
        plt.grid(color='gray', alpha=0.2)
        plt.legend(list_cv)
        plt.xticks(rotation="vertical")
            
        plt.xlabel("Date")
        plt.ylabel("Prix")
        
meanPriceByMonth()
        
def PredictModel():
    df2 = df[['date', 'prix']]
    
    dates = np.array(df2["date"].values.astype("float")).reshape(len(df2["date"]), 1)
    prices = np.array(df2["prix"]).reshape(len(df2["prix"]), 1)
    
    reg = LinearRegression()
    reg.fit(df2.date.values.reshape(-1,1), prices)
    y_pred = reg.predict(dates)
    df2['pred'] = y_pred
    
    first_month = df2.date.iloc[0].month
    first_year = df2.date.iloc[0].year
    last_month = df2.date.iloc[len(df2.date) - 1].month
    last_year = df2.date.iloc[len(df2.date) - 1].year
    intervale = (last_month - first_month) % 12
    for i in range(last_year - first_year):
        intervale += 12
    three_next_months = pd.to_datetime(pd.Series([datetime.date(last_year,i%12+1, 1) if i%12+1 >= i + 1
                                                                    else datetime.date(last_year + 1,i%12+1, 1)
                                                                    for i in range(last_month -1,ceil(intervale * 0.3))]))
    
    future_pred = reg.predict(three_next_months.values.astype("float").reshape(-1, 1))
    print(future_pred.shape)
    df_future = pd.DataFrame()
    df_future["pred"] = future_pred.reshape(-1,)
    df_future["prix"] = future_pred
    df_future["date"] = three_next_months
    df_concat = pd.concat([df2, df_future], sort=True)
    
    ax = df_concat.plot(x='date', y='pred', color='black', linewidth=2)
    ax.set_xlabel('Date')
    ax.set_ylabel('Prix')
    ax.set_ylim((0, max(df_concat.pred) * 1.3))
    print(df_concat.pred.std())
    ax.plot(df_concat.date, df_concat.pred + df_concat.pred.std(), color='blue', linewidth=2)
    ax.plot(df_concat.date, df_concat.pred - df_concat.pred.std(), color='blue', linewidth=2)
    ax.legend(("pred", "std"))
    plt.savefig('hello.png')
    
"""df = df[(df["Type de moteur"].notna())
         & (df["Série"].notna())
         & (df["Puissance de moteur [ch]"].notna())
         & (df["Type carrosserie"].notna())
         & (df["Modèle"].notna())
         & (df["Marque"].notna())
         & (df["Boite"].notna())
         & (df["Génération"].notna())
         & (df["Marque"] == "Renault")]

annee = df["Annee"]
generation = df["Génération"]
modele = df["Modèle"].str.upper()
marque = df["Marque"].str.upper()
serie = df["Série"]
carosserie = df["Type carrosserie"].str.upper()
moteur = df["Type de moteur"].str.upper()
cv = df["Puissance de moteur [ch]"]
boite = df["Boite"].str.upper()

def classifier():
    #Sans boite de vitesse (plus de données)
    model = RandomForestClassifier(n_estimators=40)
    enc_modele = LabelEncoder()
    enc_serie = LabelEncoder()
    enc_carosserie = LabelEncoder()
    enc_moteur = LabelEncoder()
    enc_boite = LabelEncoder()
    X = np.array(list(zip(
                          enc_modele.fit_transform(modele),
                          annee,
                          enc_serie.fit_transform(serie),
                          cv,
                          enc_moteur.fit_transform(moteur),
                          enc_carosserie.fit_transform(carosserie),
                          enc_boite.fit_transform(boite),
                          )))
    model.fit(X, generation)
    print(enc_modele.classes_)
    print(model.score(X, generation))
    print(enc_modele.transform(["CAPTUR"]))
"""  

 