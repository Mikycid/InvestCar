import pandas as pd

df = pd.read_excel("Car2DB_fra.xlsx",)
print(df)

"""
marque = pd.read_csv('data/car2db_fra_20200401.csv.c/car_make.csv') #id_car_make
model = pd.read_csv('data/car2db_fra_20200401.csv.c/car_model.csv', error_bad_lines=False) #id_car_model => id_car_make
generation = pd.read_csv('data/car2db_fra_20200401.csv.c/car_generation.csv',error_bad_lines=False) #id_car_generation, year_begin, year_end => id_car_model
puissance_fiscale = pd.read_csv('data/car2db_fra_20200401.csv.c/car_trim.csv',error_bad_lines=False) #name => id_car_model
series = pd.read_csv('data/car2db_fra_20200401.csv.c/car_serie.csv', error_bad_lines=False)
marque = marque.loc[:,["'id_car_make'","'name'"]]
generation = generation.loc[:, ["'id_car_model'", "'year_begin'", "'year_end'", "'name'", "'id_car_generation'"]] 
model = model.loc[:,["'id_car_make'","'id_car_model'","'name'"]]
puissance_fiscale = puissance_fiscale.loc[:,["'id_car_model'","'name'", "'id_car_serie'"]]
series = series.loc[:, ["'id_car_serie'","'id_car_generation'", "'name'"]]
result = pd.concat([model,generation,puissance_fiscale], ignore_index=True)
car_series = []
car_generation_id = []
car_generation = []
car_year_begin = []
car_year_end = []
car_models = []
id_car_marque = []
car_marque = []

for i in range(len(puissance_fiscale)):
    try:
        car_series.append(series[series["'id_car_serie'"] == puissance_fiscale["'id_car_serie'"].iloc[i]]["'name'"].iloc[0])
    except:
        car_series.append("'NC'")
    try:
        car_generation_id.append(series[series["'id_car_serie'"] == puissance_fiscale["'id_car_serie'"].iloc[i]]["'id_car_generation'"].iloc[0])
    except:
        car_generation_id.append("'NC'")

print("first done")
for i in car_generation_id:
    try:
        car_generation.append(generation[generation["'id_car_generation'"] == i]["'name'"].iloc[0])
    except: 
        car_generation.append("'NC'")
    try:
        car_year_begin.append(generation[generation["'id_car_generation'"] == i]["'year_begin'"].iloc[0])
    except:
        car_year_begin.append("'NC'")
    try:
        car_year_end.append(generation[generation["'id_car_generation'"] == i]["'year_end'"].iloc[0])
    except: 
        car_year_end.append("'NC'")

print("second done")

for i in range(len(puissance_fiscale)):
    try:
        car_models.append(model[model["'id_car_model'"] == puissance_fiscale["'id_car_model'"].iloc[i]]["'name'"].iloc[0])
    except:
        car_models.append("'NC'")
    try:
        id_car_marque.append(model[model["'id_car_model'"] == puissance_fiscale["'id_car_model'"].iloc[i]]["'id_car_make'"].iloc[0])
    except:
        id_car_marque.append("'NC'")


print("third done")
for i in id_car_marque:
    try:
        car_marque.append(marque[marque["'id_car_make'"] == i]["'name'"].iloc[0])
    except:
        car_marque.append("'NC'")
    


nouvelle_colonne = pd.DataFrame(list(zip(car_models, car_marque, car_series, car_generation, car_year_begin, car_year_end)),
                                 columns=["car_model","car_marque","car_serie","car_generation","car_year_begin","car_year_end"])

nouveau_df = pd.concat([nouvelle_colonne, puissance_fiscale], axis=1)
nouveau_df.to_csv('voiture.csv', index=False)




#all_nissan = result[result["'id_car_make'"] == "'127'"]
#a = model[model["'id_car_make'"] == "'127'"]
#for i in a["'id_car_model'"]:
#    print(generation[(generation["'id_car_model'"] == i)])
#print(generation[(generation["'id_car_model'"] == "'127'")]["'name'"])

"""