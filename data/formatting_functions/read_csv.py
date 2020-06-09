import pandas as pd


def prototype_to_data():
    df = pd.read_csv("data/prototype.csv")
    df = df[(df["Année de fin (Génération)"].notna()) & (df["Année de fin (Génération)"].astype(float) != float(0.0))]
    annee_min = df["Année de début (Génération)"]
    annee_max = df["Année de fin (Génération)"]
    df = df.drop(["Année de début (Génération)","Année de fin (Génération)"], axis=1)
    nouveau_df = pd.DataFrame(columns=df.columns.append(pd.Index(["Annee"])))
    counter = 0
    for i in range(len(annee_min)):
        print(str(i)+"/"+str(len(annee_min)))
        for j in range(0, int(annee_max.iloc[i] - annee_min.iloc[i]) + 1):
            nouveau_df.loc[counter,:-1] = df.iloc[i,:]
            nouveau_df.loc[counter,"Annee"] = j + annee_min.iloc[i]
            counter += 1



    nouveau_df.to_csv('data/real_prototype2.csv', index=False)
prototype_to_data()

def xlsx_to_prototype():
    df = pd.read_excel("data/Car2DB_fra.xlsx")
    df = df.loc[:,["Marque", "Modèle", "Génération", "Année de début (Génération)", "Année de fin (Génération)", "Série", "Version", "Type carrosserie", "Type de moteur", "Puissance de moteur [ch]", "Boite"]]
    df.to_csv("prototype_2.csv", index=False)
