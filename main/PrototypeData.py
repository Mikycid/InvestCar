import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import re

class PrototypeData:

    def __init__(self):
        self.data = pd.read_excel("data/Car2DB_fra.xlsx")
        self.prototypeData = pd.read_csv("data/real_prototype.csv")
        self.prototypeData = self.prototypeData[
                                                (self.prototypeData["Série"].notna())
                                                & (self.prototypeData["Modèle"].notna())
                                                & (self.prototypeData["Marque"].notna())
                                                & (self.prototypeData["Génération"].notna())
                                                ]


    def classify_gen(self, mod, marque, ann, pui, cyl, car, tra):
        df_sorted = self.prototypeData[
            (self.prototypeData["Modèle"].str.lower() == mod.lower())
            & (self.prototypeData["Marque"].str.lower() == marque.lower())
            & (self.prototypeData["Annee"] == float(ann))]
        if len(df_sorted) == 1:
            return df_sorted["Génération"].iloc[0]
        annee = df_sorted["Annee"]
        generation = df_sorted["Génération"]
        cv = df_sorted["Version"].apply(lambda x: int(re.search(r"(\d+) [cv|ch]", x).group(1)))
        cylindree = df_sorted["Version"].apply(lambda x: float(re.search(r"(\d+\.?\d+)", x).group(1)))

        carburant = df_sorted["Type de moteur"].str.lower()
        enc_carb = LabelEncoder()
        enc_carb.fit(carburant)
        
        transmition = df_sorted["Boite"].str.lower().apply(lambda x: "automatique" if x == "robot" else x)
        enc_transmition = LabelEncoder()
        enc_transmition.fit(transmition)

        model = RandomForestClassifier(n_estimators=40)
        X = np.array(list(zip(
                            cv,
                            cylindree,
                            enc_transmition.transform(transmition),
                            enc_carb.transform(carburant)
                            )))
        model.fit(X, generation)
        try:
            encoded_carb = enc_carb.transform([car.lower()])
            encoded_trans = enc_transmition.transform([tra.lower()])
        except:
            encoded_carb = enc_carb.transform(["nc"])
            encoded_trans = enc_transmition.transform(["nc"])

        return model.predict([[
                            pui,
                            cyl,
                            encoded_carb,
                            encoded_trans
                            ]])

    def classify_car(self, mod, marque, ann, pui, gen, cyl, car, tra):
        if type(gen) == str:
            df_sorted = self.prototypeData[
                (self.prototypeData["Modèle"].str.lower() == mod.lower())
                & (self.prototypeData["Marque"].str.lower() == marque.lower())
                & (self.prototypeData["Annee"] == float(ann))
                & (self.prototypeData["Génération"].str.lower() == gen)]
        else:
            df_sorted = self.prototypeData[
                (self.prototypeData["Modèle"].str.lower() == mod.lower())
                & (self.prototypeData["Marque"].str.lower() == marque.lower())
                & (self.prototypeData["Annee"] == float(ann))
                & (self.prototypeData["Génération"].str.lower() == gen[0])]
        carrosserie = df_sorted["Série"].str.lower().apply(lambda x: "Hatchback" if re.match("(.+)?hatchback(.+)?", x, re.IGNORECASE)
                                                                    else "Monospace" if re.match("(.+)?monospace(.+)?", x, re.IGNORECASE) or re.match("(.+)?minivan(.+)?", x, re.IGNORECASE)
                                                                    else "Break" if re.match("(.+)?break(.+)?", x, re.IGNORECASE)
                                                                    else "Coupé" if re.match("(.+)?coupé(.+)?", x, re.IGNORECASE)
                                                                    else "Berline" if re.match("(.+)?berline(.+)?", x, re.IGNORECASE)
                                                                    else "4x4/SUV" if re.match("(.+)?suv(.+)?", x, re.IGNORECASE) or re.match("(.+)?pick-up(.+)?", x, re.IGNORECASE) or re.match("(.+)?crossover(.+)?", x, re.IGNORECASE)
                                                                    else "Cabriolet" if re.match("(.+)?cabriolet(.+)?", x, re.IGNORECASE) or re.match("(.+)roadster(.+)", x, re.IGNORECASE) or re.match("(.+)targa(.+)", x, re.IGNORECASE)
                                                                    or re.match("(.+)spyder(.+)", x, re.IGNORECASE)
                                                                    else x
                                                                    )
        if len(df_sorted) == 1:
            return df_sorted["Série"].iloc[0]

        cv = df_sorted["Version"].apply(lambda x: int(re.search(r"(\d+) [cv|ch]", x).group(1)))
        
        carburant = df_sorted["Type de moteur"].str.lower()
        enc_carb = LabelEncoder()
        enc_carb.fit(carburant)

        transmition = df_sorted["Boite"].str.lower().apply(lambda x: "automatique" if x == "robot" else x)
        enc_transmition = LabelEncoder()
        enc_transmition.fit(transmition)


        cylindree = df_sorted["Version"].apply(lambda x: float(re.search(r"(\d+\.?\d+)", x).group(1)))
        model = RandomForestClassifier(n_estimators=40)

        X = np.array(list(zip(
                            cv,
                            cylindree,
                            enc_transmition.transform(transmition),
                            enc_carb.transform(carburant)
                            )))
        
        model.fit(X, carrosserie)
        
        score = model.score(X, carrosserie)
        try:
            encoded_carb = enc_carb.transform([car.lower()])
            encoded_trans = enc_transmition.transform([tra.lower()])
        except:
            encoded_carb = enc_carb.transform(["nc"])
            encoded_trans = enc_transmition.transform(["nc"])
        
        result = model.predict([[
                                pui,
                                cyl,
                                encoded_carb,
                                encoded_trans
                                ]])
        
        return result
    
    
    

    def getAllMotors(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        
        
        return list(df["Version"].drop_duplicates())
    
    def getAllSeries(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            mot_ts[mot] = df_sorted["Série"].iloc[0]

        return mot_ts

    def getGenerations(self, marque, model):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower())]
        return list(df["Génération"].drop_duplicates())
    
    def getTimeStamp(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Année de début (Génération)"] = df_sorted["Année de début (Génération)"].fillna("Non connu")
            df_sorted["Année de fin (Génération)"] = df_sorted["Année de fin (Génération)"].fillna("Non connu")
            mot_ts[mot] = str(df_sorted["Année de début (Génération)"].iloc[0])[0:4] + "-" + str(df_sorted["Année de fin (Génération)"].iloc[0])[0:4]

        return mot_ts

    def getEnergyType(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Type de moteur"] = df_sorted["Type de moteur"].fillna("Non connu")
            mot_ts[mot] = df_sorted["Type de moteur"].iloc[0]

        return mot_ts
    
    def getCouple(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Couple maximal [N*m]"] = df_sorted["Couple maximal [N*m]"].fillna("Non connu")
            mot_ts[mot] = df_sorted["Couple maximal [N*m]"].iloc[0]

        return mot_ts
    
    def getNbCylindre(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Nombre de cylindres"] = df_sorted["Nombre de cylindres"].fillna("Non connu")
            mot_ts[mot] = df_sorted["Nombre de cylindres"].iloc[0]

        return mot_ts

    def isTurbo(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Type de suralimentation"] = df_sorted["Type de suralimentation"].fillna("X")
            mot_ts[mot] = df_sorted["Type de suralimentation"].iloc[0]

        return mot_ts
    
    def getVMax(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Vitesse max [km/h]"] = df_sorted["Vitesse max [km/h]"].fillna("Non connu")
            mot_ts[mot] = df_sorted["Vitesse max [km/h]"].iloc[0]

        return mot_ts
    
    def getZeroHundred(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Consommation urbaine sur 100 km [l]"] = df_sorted["Consommation urbaine sur 100 km [l]"].fillna("Non connu")
            mot_ts[mot] = df_sorted["Consommation urbaine sur 100 km [l]"].iloc[0]

        return mot_ts

    def getInjection(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Type de injection"] = df_sorted["Type de injection"].fillna("Non connu")
            mot_ts[mot] = df_sorted["Type de injection"].iloc[0]

        return mot_ts
    
    def getUrbanConso(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Consommation urbaine sur 100 km [l]"] = df_sorted["Consommation urbaine sur 100 km [l]"].fillna("Non connu")
            mot_ts[mot] = df_sorted["Consommation urbaine sur 100 km [l]"].iloc[0]

        return mot_ts

    def getExtraUrbanConso(self, marque, model, gen):
        df = self.data[(self.data["Modèle"].str.lower() == model.lower()) & (self.data["Marque"].str.lower() == marque.lower()) & (self.data["Génération"].str.lower() == gen.lower())]
        moteurs = self.getAllMotors(marque, model, gen)
        mot_ts = {}
        for mot in moteurs:
            df_sorted = df[df["Version"] == mot]
            df_sorted["Consommation extra-urbaine sur 100 km [l]"] = df_sorted["Consommation extra-urbaine sur 100 km [l]"].fillna("Non connu")
            mot_ts[mot] = df_sorted["Consommation extra-urbaine sur 100 km [l]"].iloc[0]

        return mot_ts

    