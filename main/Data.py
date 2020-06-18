import pandas as pd
import statistics as st
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import numpy as np
import os
import warnings
import datetime
from math import ceil, isnan
import re
import pickle
from threading import Thread
import time
from reportlab.platypus import BaseDocTemplate, Paragraph, PageBreak, Image, Table, TableStyle, Spacer, PageTemplate, NextPageTemplate, Frame
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.units import mm
from svglib.svglib import svg2rlg
from . import PrototypeData
from cryptography.fernet import Fernet


FILES = [
    "data/models_database/Audi.csv",
    "data/models_database/Peugeot.csv",]
"""    "data/models_database/Ferrari.csv",
    "data/models_database/Renault.csv",
    "data/models_database/BMW.csv",
    "data/models_database/Alpine.csv"]"""
STATES = [
    "<5000km",
    "<50000km",
    "<150000km",
    "<250000km",
    "250000+km",
]
warnings.simplefilter(action='ignore', category=FutureWarning)
pd.options.mode.chained_assignment = None

class DataMachine(Thread):
    
    
    
    def __init__(self):
        Thread.__init__(self)
        self.df = pd.DataFrame()
        
        self.prototype_data = PrototypeData.PrototypeData()
        self.cleanCsvDatas()
        self.key = Fernet.generate_key()
        self.protected_encrypted = "protected-"+Fernet(self.key).encrypt(b"protected").decode("utf-8")
        self.encrypted_pdf = "pdf-"+Fernet(self.key).encrypt(b"pdfpro").decode("utf-8")
        
        os.system(r'find . -name "protected\-*" -type d -execdir rename "s/.+/'+self.protected_encrypted+r'/" {} \; >/dev/null 2>&1')
        os.system(r'find . -name "pdf\-*" -type d -execdir rename "s/.+/'+self.encrypted_pdf+r'/" {} \; >/dev/null 2>&1')
        
        marques = list(self.df.drop_duplicates(subset=["modele", "marque", "generation"]).marque)
        modeles = list(self.df.drop_duplicates(subset=["modele", "marque", "generation"]).modele)
        generations = list(self.df.drop_duplicates(subset=["modele", "marque", "generation"]).generation)
        
        self.markmodeles = list(self.df.drop_duplicates(subset=["modele", "marque", "generation"]).marque + " " +
                                self.df.drop_duplicates(subset=["modele", "marque", "generation"]).modele + " " +
                                self.df.drop_duplicates(subset=["modele", "marque", "generation"]).generation)
               
        motors = []
        motors_mean = []
        motors_percentages = []
        self.motors_end = []
        self.max_model_entries = 0
        percentages = []
        for i in range(len(marques)):
            percentages.append(round(self.percentageVartiation(marques[i], modeles[i], generations[i], df=self.df), 4))
            motor_df = list(self.df[(self.df["marque"] == marques[i])
                                & (self.df["modele"] == modeles[i])
                                & (self.df["generation"] == generations[i])].chevaux_din.drop_duplicates())
            motors.append([])
            motors_mean.append([])
            motors_percentages.append([])
            nb_datas = len(self.df[(self.df["marque"] == marques[i]) & (self.df["modele"] == modeles[i]) & (self.df["generation"] == generations[i])].generation)
            if nb_datas > self.max_model_entries:
                self.max_model_entries = nb_datas
            for motor in motor_df:
                mean = round(self.df[(self.df["marque"] == marques[i])
                                & (self.df["modele"] == modeles[i])
                                & (self.df["generation"] == generations[i])
                                & (self.df["chevaux_din"] == motor)].prix.mean(), 4)
                if len(motors[i]) < 3:
                    motors[i].append(motor)
                    motors_mean[i].append(mean)
                    motors_percentages[i].append(round(self.percentageVartiation(marques[i], modeles[i], generations[i], df=self.df, mot=motor), 4))
                else:
                    if mean > min(motors_mean[i]):
                        motors[i][motors_mean[i].index(min(motors_mean[i]))] = motor
                        motors_mean[i][motors_mean[i].index(min(motors_mean[i]))] = mean
                        motors_percentages[i].append(round(self.percentageVartiation(marques[i], modeles[i], generations[i], df=self.df, mot=motor), 4))
            
            self.motors_end.append(sorted(list(zip(motors[i], motors_mean[i], motors_percentages[i])), key=lambda x: x[2], reverse=True))
                
        self.percentages = percentages
        sorted_df = list(zip(self.markmodeles, self.percentages, self.motors_end))
        self.markmodeles, self.percentages, self.motors_end = zip(*sorted(sorted_df, key=lambda x: x[1], reverse=True))
        
            
            
        
    def closest(self, lst, K): 
        return lst[min(range(len(lst)), key = lambda i: abs(lst[i]-K))] 






    def updateMainVars(self):
        today = datetime.date.today()
        today_minus_three_month = today - datetime.timedelta(days=90)
        marques = list(self.df[self.df.date > today_minus_three_month.strftime("%d-%m-%Y")].drop_duplicates(subset=["modele", "marque", "generation"]).marque)
        modeles = list(self.df[self.df.date > today_minus_three_month.strftime("%d-%m-%Y")].drop_duplicates(subset=["modele", "marque", "generation"]).modele)
        generations = list(self.df[self.df.date > today_minus_three_month.strftime("%d-%m-%Y")].drop_duplicates(subset=["modele", "marque", "generation"]).generation)
        
        motors = []
        motors_mean = []
        motors_percentages = []
        self.motors_end = []
        self.max_model_entries = 0
        percentages = []
        for i in range(len(marques)):
            percentages.append(round(self.percentageVartiation(marques[i], modeles[i], generations[i], df=self.df), 4))
            motor_df = list(self.df[(self.df["marque"] == marques[i])
                                & (self.df["modele"] == modeles[i])
                                & (self.df["generation"] == generations[i])].chevaux_din.drop_duplicates())
            motors.append([])
            motors_mean.append([])
            motors_percentages.append([])
            nb_datas = len(self.df[(self.df["marque"] == marques[i]) & (self.df["modele"] == modeles[i]) & (self.df["generation"] == generations[i])].generation)
            if nb_datas > self.max_model_entries:
                self.max_model_entries = nb_datas
            for motor in motor_df:
                mean = round(self.df[(self.df["marque"] == marques[i])
                                & (self.df["modele"] == modeles[i])
                                & (self.df["generation"] == generations[i])
                                & (self.df["chevaux_din"] == motor)].prix.mean(), 4)
                if len(motors[i]) < 3:
                    motors[i].append(motor)
                    motors_mean[i].append(mean)
                    motors_percentages[i].append(round(self.percentageVartiation(marques[i], modeles[i], generations[i], df=self.df, mot=motor), 4))
                else:
                    if mean > min(motors_mean[i]):
                        motors[i][motors_mean[i].index(min(motors_mean[i]))] = motor
                        motors_mean[i][motors_mean[i].index(min(motors_mean[i]))] = mean
                        motors_percentages[i].append(round(self.percentageVartiation(marques[i], modeles[i], generations[i], df=self.df, mot=motor), 4))
            
            self.motors_end.append(sorted(list(zip(motors[i], motors_mean[i], motors_percentages[i])), key=lambda x: x[2], reverse=True))
                
        self.percentages = percentages
        sorted_df = list(zip(self.markmodeles, self.percentages, self.motors_end))
        self.markmodeles, self.percentages, self.motors_end = zip(*sorted(sorted_df, key=lambda x: x[1], reverse=True))
    
    def update(self):
        
        self.cleanCsvDatas()
        with open("data/data.pickle", "rb") as f:
            data_list = pickle.load(f)
        if len(data_list):
            to_update = data_list[0].split(";")
        else:
            return "No data to update"
        
        df = self.df[(self.df["modele"].str.lower() == to_update[1].lower())
                    & (self.df["marque"].str.lower() == to_update[0].lower())
                    & (self.df["generation"].str.lower() == to_update[2].lower())]
        self.meanPriceByMonthPlt(to_update[0],to_update[1], to_update[-2],to_update[2], to_update[3], df)
        
        try:
            self.predictModel(to_update[0],to_update[1], to_update[-2],to_update[2], to_update[3], data_list[-1], df)
        except ValueError:
            print("Not enough data for regression")
        self.plotDataVolume(to_update[0],to_update[1], to_update[2], df)
        self.plotMotor(to_update[0],to_update[1], to_update[2], df)
        self.plotTransmission(to_update[0],to_update[1], to_update[2], df)
        self.makePdf(to_update[0], to_update[1], to_update[2])
        with open("data/data.pickle", "w+b") as f:
            data_list.pop(0)
            pickle.dump(data_list, f)
        return to_update

    def update_files_encryption(self):
        self.key = Fernet.generate_key()
        self.protected_encrypted = "protected-"+Fernet(self.key).encrypt("protected").decode("utf-8")
        os.system(r'find . -name "protected\-*" -type d -execdir rename "s/.+/'+self.protected_encrypted+r'/" {} \; >/dev/null 2>&1')
        self.encrypted_pdf = "pdf-"+Fernet(self.key).encrypt("protected").decode("utf-8")
        os.system(r'find . -name "pdf\-*" -type d -execdir rename "s/.+/'+self.encrypted_pdf+r'/" {} \; >/dev/null 2>&1')

    def run(self):
        timer_update_plots = datetime.datetime.now()
        timer_update_vars = datetime.datetime.now()
        while(1):
            now_time = datetime.datetime.now()
            if now_time.strftime("%Y-%m-%d %H:%M") == (timer_update_plots + datetime.timedelta(minutes=1)).strftime("%Y-%m-%d %H:%M"):
                updated = self.update()
                timer_update_plots = datetime.datetime.now()
                print("Updated plots for : " + str(updated))
            if now_time.strftime("%Y-%m-%d %H:%M") == (timer_update_vars + datetime.timedelta(minutes=240)).strftime("%Y-%m-%d %H:%M"):
                self.updateMainVars()
                timer_update_vars = datetime.datetime.now()
                print("Updated main vars")
            if now_time.strftime("%Y-%m-%d %H:%M") == (timer_update_vars + datetime.timedelta(hours=24)).strftime("%Y-%m-%d %H:%M"):
                self.update_files_encryption()
                
                print("Updated files encryption")
            time.sleep(5)

    
    
    
    
    
    
    
    def pickleSave(self, data):
        #data must be a string of structure : marque;modele;generation;carrosserie;etat;moteur
        try:
            with open("data/data.pickle", "rb") as outfile:
                data_list = pickle.load(outfile)
        except FileNotFoundError:
            data_list=[]
        except EOFError:
            data_list=[]
        if not data in data_list:
            with open("data/data.pickle", "w+b") as outfile:
                data_list.append(data)
                pickle.dump(data_list, outfile)
            
    def formatState(self, km):
        try:
            km = int(km)
            state = ""
            if km < 5000:
                state = "<5000km"
            elif km < 50000:
                state = "<50000km"
            elif km < 150000:
                state = "<150000km"
            elif km < 250000:
                state = "<250000km"
            elif km > 250000:
                state = "250000+km"
        except:
            state = "NC"
        return state
    
    def addNewLine(self, *args):
        errors = []
        for line in args:

            if len(line) != 13:
                errors.append(args.index(line))
            else:
                line.append(self.formatState(line[8]))
                new_line = pd.DataFrame([line])
                new_line.to_csv('data/staff_datas.csv', mode='a', header=False, index=False)
                self.pickleSave(line[0] + ";" + line[1] + ";" + line[3] + ";" + line[4] + ";" + line[-1] + ";" + line[-2])
             
        return errors
    
    def addNewCsv(self, csv):
        df = pd.read_csv(csv)
        df.columns = ["marque", "modele", "prix", "generation", "carrosserie", "annee", "date", "energie", "kilometrage", "transmition", "code postal", "chevaux_fiscaux", "chevaux_din"]
        
        df["etat"] = ["NC" if i == "-" or i == "kilometrage" else "<5000km" if int(i)< 5000 else "<50000km" if int(i) < 50000 else "<150000km" if int(i)<150000 else "<250000km" if int(i) < 250000 else "250000+km" for i in df.kilometrage]
        df = df[df["chevaux_din"] != 0]
        df["carrosserie"] = df["carrosserie"].apply(lambda x: x.replace("/", "slashcharacter001"))
        df["generation"] = df["generation"].apply(lambda x: x.replace("/", "slashcharacter001"))
        df["marque"] = df["marque"].apply(lambda x: x.replace("/", "slashcharacter001"))
        df["modele"] = df["modele"].apply(lambda x: x.replace("/", "slashcharacter001"))
        df["prix"] = df["prix"].apply(lambda x: re.search(r"\d+", x).group(0))
        to_update = df.drop_duplicates(subset=["marque", "modele", "carrosserie", "etat", "generation"]).reset_index()
        
        
        for i in range(len(to_update)):
            data = to_update.loc[i, "marque"] + ";" + to_update.loc[i, "modele"] + ";" + to_update.loc[i, "generation"] + ";" + to_update.loc[i, "carrosserie"] + ";" + to_update.loc[i, "etat"] + ";" + str(to_update.loc[i, "chevaux_din"])
            self.pickleSave(data)
        main_df = pd.read_csv('data/staff_datas.csv')
        new_df = pd.concat([df, main_df], axis=0)
        new_df.to_csv('data/staff_datas.csv', index=False)
 

    def query(self, query, column):
        if column == "marque":
            return self.df[self.df["marque"].str.contains("^"+query, regex=True, case=False)]
        elif column == "modele":
            marque = self.df["marque"].astype('str')
            modele = self.df["modele"].astype('str')
            return self.df[(modele.str.contains("^"+query.upper(), regex=True))
             | marque.str.contains(query.upper())
             | (modele + " " + marque).str.contains(query,case=False)
             | (marque + " " + modele).str.contains(query,case=False)
             ]
        elif column == "generation":
            marque = self.df["marque"].astype('str')
            modele = self.df["modele"].astype('str')
            version = self.df["generation"].astype('str')
            
            return self.df[(modele.str.contains("^"+query.upper(), regex=True))
             | marque.str.contains(query.upper())
             | (modele + " " + marque + " " + version).str.contains(re.escape(query),regex=True, case=False)
             | (modele + " " + version + " " + marque).str.contains(re.escape(query),regex=True, case=False)
             | (marque + " " + modele + " " + version).str.contains(re.escape(query),regex=True, case=False)
             | (marque + " " + version + " " + modele).str.contains(re.escape(query),regex=True, case=False)
             | (version + " " + marque + " " + modele).str.contains(re.escape(query),regex=True, case=False)
             | (version + " " + modele + " " + marque).str.contains(re.escape(query),regex=True, case=False)
             ]
    
    def cleanCsvDatas(self):
        dfs = []
        for i in range(len(FILES)):
            dfs.append(pd.read_csv(FILES[i]))
        j = 0
        for df in dfs:
            df = df.drop_duplicates()
            if len(df.columns) == 14:
                df.columns = ["marque", "modele", "prix", "generation", "carrosserie", "annee", "date", "energie", "kilometrage", "transmition", "code postal", "chevaux_fiscaux", "chevaux_din", "etat"]
            elif len(df.columns) == 13:
                df.columns = ["marque", "modele", "prix", "generation", "carrosserie", "annee", "date", "energie", "kilometrage", "transmition", "code postal", "chevaux_fiscaux", "chevaux_din"]
            df = df[(df["prix"].notna()) & (df["prix"] != "NC") & (df["code postal"].astype(str).str.isdigit()) & (df["modele"] != "Autres") & (df["chevaux_din"] != 0)]
            prix = df["prix"]
            prix = prix.replace(to_replace=" \u20AC", value="", regex=True).replace(to_replace=" ", value="", regex=True).replace(to_replace="NC", value="")
            try:
                prix = prix.apply(lambda x: re.search(r"\d+", x).group(0))
            except TypeError:
                pass
            kilometrage = df["kilometrage"]
            kilometrage = kilometrage.replace(to_replace="( (KM)|(km))", value="", regex=True).replace(to_replace=" ", value="", regex=True)
            df["carrosserie"] = df["carrosserie"].str.replace("/", "_")
            df["prix"] = prix
            df["kilometrage"] = kilometrage
            df["etat"] = ["NC" if i == "-" or i == "kilometrage" else "<5000km" if int(i)< 5000 else "<50000km" if int(i) < 50000 else "<150000km" if int(i)<150000 else "<250000km" if int(i) < 250000 else "250000+km" for i in kilometrage]
            df["marque"] = df["marque"].str.upper()
            df["modele"] = df["modele"].str.upper()
            df["transmition"] = df["transmition"].str.upper()
            df["energie"] = df["energie"].str.upper()
            df["carrosserie"] = df["carrosserie"].apply(lambda x: x.replace("/", "slashcharacter001"))
            df["generation"] = df["generation"].apply(lambda x: x.replace("/", "slashcharacter001"))
            df["marque"] = df["marque"].apply(lambda x: x.replace("/", "slashcharacter001"))
            df["modele"] = df["modele"].apply(lambda x: x.replace("/", "slashcharacter001"))
            df["code postal"] = df["code postal"].astype('str').apply(lambda x: x[0:5])
            df = df[(df["chevaux_din"] != df["chevaux_fiscaux"]) & (df["energie"] != 0) & (df["energie"] != "0")]
            
            """
            This is for cleaning the integrity of datas on puissance_din column
            df = df.reset_index()
            for i in range(len(df)):
                to_format = self.prototype_data.prototypeData[(self.prototype_data.prototypeData["Marque"].str.lower() == df.loc[i,"marque"].lower())
                                                                & (self.prototype_data.prototypeData["Modèle"].str.lower() == df.loc[i,"modele"].lower())
                                                                & (self.prototype_data.prototypeData["Génération"].str.lower() == df.loc[i,"generation"].replace("slashcharacter001", "/").lower())]
                
                cv = list(to_format["Version"].apply(lambda x: int(re.search(r"(\d+) [cv|ch]", x).group(1))).drop_duplicates())
                
                df.loc[i, "chevaux_din"] = self.closest(cv, df.loc[i,"chevaux_din"])"""
            df.to_csv(FILES[j], index=False)
            dfs[j] = df; j+=1
        self.df = pd.concat(dfs)
        self.df["chevaux_din"] = self.df["chevaux_din"].astype(int)
        self.df = self.df.drop_duplicates()
        

        
    def makePdf(self, marque, model, gen):
        styles = {'title':ParagraphStyle('title', fontSize=70, leading=100*mm, alignment=TA_CENTER),
                  'subtitle':ParagraphStyle('subtitle', fontSize=50, leading=100*mm, alignment=TA_CENTER),
                  'subsubtitle':ParagraphStyle('subsubtitle', fontSize=35, leading=100*mm, alignment=TA_CENTER),
                  'legend': ParagraphStyle('legend', fontSize=12, leading=8*mm, alignment=TA_CENTER),
                  'legend_proto': ParagraphStyle('legend', fontSize=12, leading=8*mm, alignment=TA_RIGHT),
                  'red_legend': ParagraphStyle('legend', fontSize=12, leading=8*mm, alignment=TA_CENTER, textColor='red'),
                  'percentageNegative': ParagraphStyle('percentage', fontSize=16, leading=20, alignment=TA_CENTER, borderWidth=1, borderColor='red', textColor='red'),
                  'percentagePositive': ParagraphStyle('percentage', fontSize=16, leading=20, alignment=TA_CENTER, borderWidth=1, borderColor='green', textColor='green')}
        chart_style = TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER'),
                                  ('VALIGN', (0,0), (-1,-1), 'CENTER')])
        proto_style = TableStyle([('ALIGN', (0,0), (0,0), 'LEFT'),
                                  ('ALIGN', (-1,-1), (-1,-1), 'RIGHT'),
                                  ('VALIGN', (0,0), (-1,-1), 'CENTER')])
        zipcodes_style = TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER')])
        infos_style = TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER'),
                                ('HALIGN', (0,0), (-1,-1), 'CENTER')])
        
        def scale(drawing, scaling_factor):
            """
            Scale a reportlab.graphics.shapes.Drawing()
            object while maintaining the aspect ratio
            """
            scaling_x = scaling_factor
            scaling_y = scaling_factor
            
            drawing.width = drawing.minWidth() * scaling_x
            drawing.height = drawing.height * scaling_y
            drawing.scale(scaling_x, scaling_y)
            return drawing
        def percentageStyle(percentage, months):
            if percentage < 0:
                return Paragraph("<b>"+ str(percentage) +" %</b><br/> Les " + str(months) + " derniers mois", styles['percentageNegative'])
            else:
                return Paragraph("<b>"+ str(percentage) +" %</b><br/> Les " + str(months) + " derniers mois", styles['percentagePositive'])
        path = os.path.join("./frontend/static/frontend/models/",marque.replace(" ", "_"),model.replace(" ", "_"),gen.replace(" ", "_"))
        pdf_path = os.path.join("./frontend/static/frontend/models/",marque.replace(" ", "_"),model.replace(" ", "_"),gen.replace(" ", "_"),self.encrypted_pdf)
        if not os.path.isdir(pdf_path) : os.makedirs(pdf_path)
        normal_path = os.path.join("./frontend/static/frontend/models/",marque.replace(" ", "_"),model.replace(" ", "_"),gen.replace(" ", "_"),self.protected_encrypted)
        title_doc = pdf_path+"/"+"_".join(marque.split(" "))+"_"+"_".join(model.split(" "))+"_"+"_".join(gen.split(" "))+".pdf"
        pdf = BaseDocTemplate(title_doc,
                                pagesize=(297*mm, 420*mm),
                                topMargin=20*mm,
                                leftMargin=20*mm,
                                rightMargin=20*mm,
                                bottomMargin=20*mm,
                                title=marque+ " " + model + " " + gen)
        portrait_frame = Frame(20*mm, 20*mm, pdf.width, pdf.height, id='portrait_frame ')
        landscape_frame = Frame(60*mm, 20*mm, pdf.height, pdf.width, id='landscape_frame ')
        pdf.addPageTemplates([PageTemplate(id='portrait',frames=portrait_frame),
                      PageTemplate(id='landscape',frames=landscape_frame, pagesize=(510*mm, 420*mm)),
                      ])
        flowables = []
        
        
        
        title1 = Paragraph("<b>"+ marque +"</b><br/>", styles['title'])
        title2 = Paragraph("<b>"+ model +"</b><br/>", styles['subtitle'])
        title3 = Paragraph("<b>"+ gen +"</b><br/>", styles['subsubtitle'])
        logo = Image("./frontend/static/frontend/imgs/logo-no-transparency.png")
        logo_proto = Image("./frontend/static/frontend/imgs/logo-no-transparency.png", width=25*mm, height=25*mm)
        title_proto = Paragraph("<b><i>"+marque + " " + model + " " + gen+"</i></b>", styles['legend_proto'])
        
        page_proto = Table([[logo_proto, title_proto]],
                            colWidths=[297/2*mm, 297/2*mm],
                            rowHeights=[25*mm],
                            style=proto_style)
        flowables.append(title1); flowables.append(title2); flowables.append(title3); flowables.append(logo)
        flowables.append(PageBreak())
        flowables.append(page_proto)
        # Some text
        flowables.append(PageBreak())
        flowables.append(page_proto)
        legend1 = Paragraph('<i>Types d\'énergie</i>', styles['legend'])
        pie_graph_1 = svg2rlg(os.path.join(path, 'energie.svg')); pie_graph_1 = scale(pie_graph_1, 0.5)
        legend2 = Paragraph('<i>Types de transmition</i>', styles['legend'])
        pie_graph_2 = svg2rlg(os.path.join(path, 'transmission.svg')); pie_graph_2 = scale(pie_graph_2, 0.5)
        legend3 = Paragraph('<i>Volume de données en fonction du temps</i>', styles['legend'])
        data_volume_graph = svg2rlg(os.path.join(normal_path, 'volume_data.svg')); data_volume_graph = scale(data_volume_graph, 0.8)
        data_volume_graph.hAlign = 'CENTER'
        flowables.append(Spacer(1, 30*mm))
        flowables.append(Table([[legend1, legend2],
                                [pie_graph_1, pie_graph_2]],
                                colWidths=[297/2*mm, 297/2*mm],
                                style=chart_style))
        flowables.append(Spacer(1, 30*mm))
        flowables.append(legend3)
        flowables.append(data_volume_graph)
        flowables.append(PageBreak())
        flowables.append(page_proto)
        carrosseries = os.listdir(path)
        for carr in carrosseries:
            
            if os.path.isdir(os.path.join(path, carr)):
                states = os.listdir(os.path.join(path, carr))
                for state in states:
                    if os.path.isdir(os.path.join(path, carr, state)):
                        main_title = Paragraph('<b>' + carr + ' ' + state + '</b>', styles['title'])
                        centered_main_title = Table([[main_title]],
                                                    colWidths=[716],
                                                    rowHeights=[950],
                                                    style=chart_style)
                        flowables.append(centered_main_title)
                        flowables.append(PageBreak())
                        flowables.append(page_proto)
                        percentage1 = self.percentageVartiation(marque, model, gen, self.df, car=carr,days_variation=90)
                        percentage2 = self.percentageVartiation(marque, model, gen, self.df, car=carr,days_variation=180)
                        percentage3 = self.percentageVartiation(marque, model, gen, self.df, car=carr,days_variation=365)
                        flowables.append(Table([[percentageStyle(percentage1, 3), percentageStyle(percentage2, 6), percentageStyle(percentage3, 12)]],
                                                colWidths=[297/3*mm, 297/3*mm, 297/3*mm],
                                                style=chart_style))
                        flowables.append(Spacer(0,30*mm))
                        mean_price_legend = Paragraph('<i>Prix moyen en fonction du temps</i>', styles['legend'])
                        mean_price_chart = svg2rlg(os.path.join(path, carr, state, 'meanPriceByMonth.svg'))
                        
                        mean_price_chart.hAlign = 'CENTER'
                        mean_price_chart = scale(mean_price_chart, 0.8)
                        flowables.append(mean_price_legend)
                        flowables.append(mean_price_chart)
                        flowables.append(Spacer(0,20*mm))
                        motors = os.listdir(os.path.join(path, carr, state))
                        counter = 1
                        for motor in motors:
                            if os.path.isdir(os.path.join(path, carr, state, motor)):
                                if counter % 2 == 0:
                                    flowables.append(PageBreak())
                                    flowables.append(page_proto)
                                motor_legend = Paragraph('<i>'+str(counter)+'. '+ motor +' cv</i>', styles['legend'])
                                reg = svg2rlg(os.path.join(path, carr, state, motor, self.protected_encrypted, 'regression.svg'))
                                reg.hAlign = 'CENTER'
                                reg = scale(reg, 0.8)
                                flowables.append(motor_legend)
                                flowables.append(reg)
                                flowables.append(Spacer(0,20*mm))
                                zipcodes = self.zipCodes(model, marque,gen=gen,car=carr,mot=motor)
                                max_value = 0
                                table_zipcodes = [["Département", "Pourcentage"]]
                                for i in zipcodes:
                                    if zipcodes.count(i) > max_value:
                                        max_value = zipcodes.count(i)
                                for i in set(zipcodes):
                                    table_zipcodes.append([i, round(zipcodes.count(i) / max_value * 100, 2)])
                                table_zipcodes_flow = Table(table_zipcodes,
                                                            colWidths=[100*mm, 100*mm],
                                                            style=zipcodes_style)
                                zipcodes_legend = Paragraph('<b>Attention les données selon les départements ne correspondent pas à l\'état du véhicule</b>', styles["red_legend"])
                                flowables.append(zipcodes_legend)
                                flowables.append(table_zipcodes_flow)

                                counter += 1
                        flowables.append(PageBreak())
                        flowables.append(page_proto)
        infos_title = Paragraph('<b>Informations sur le véhicule</b>', styles['title'])
        centered_infos_title = Table([[infos_title]],
                                    colWidths=[716],
                                    rowHeights=[950],
                                    style=chart_style)
        flowables.append(centered_infos_title)
        
        flowables.append(NextPageTemplate('landscape'))
        flowables.append(PageBreak())
        motors = self.prototype_data.getAllMotors(marque, model, gen)
        series = self.prototype_data.getAllSeries(marque, model, gen)
        years = self.prototype_data.getTimeStamp(marque, model, gen)
        energy = self.prototype_data.getEnergyType(marque, model, gen)
        couple = self.prototype_data.getCouple(marque, model, gen)
        cylindres = self.prototype_data.getNbCylindre(marque, model, gen)
        turbo = self.prototype_data.isTurbo(marque, model, gen)
        vmax = self.prototype_data.getVMax(marque, model, gen)
        zero_to_hundred = self.prototype_data.getZeroHundred(marque, model, gen)
        injection = self.prototype_data.getInjection(marque, model, gen)
        urban_conso = self.prototype_data.getUrbanConso(marque, model, gen)
        extra_urban_conso = self.prototype_data.getExtraUrbanConso(marque, model, gen)
        infos_table = [["Moteur", "Série", "Années de création", "Energie", "Couple", "Cylindres", "Turbo ?", "Vmax", "0 à 100km/h", "Injection", "Consommation en milieu urbain", "Consommation en milieu extra-urbain"]]
        for mot in motors:
            infos_table.append([mot, str(series[mot]), str(years[mot]), str(energy[mot]), str(couple[mot]), str(cylindres[mot]), str(turbo[mot]), str(vmax[mot]), str(zero_to_hundred[mot]), str(injection[mot]), str(urban_conso[mot]), str(extra_urban_conso[mot])])
                  
        infos_table_flow = Table(infos_table,
                                 style=infos_style)      
        flowables.append(infos_table_flow)        
        pdf.build(flowables)
        
        
        
        

    


    def predictModel(self, marque, model, state, gen, car, mot, df):
        df_sorted = df[(df["modele"].str.lower() == model.lower()) 
                        & (df["marque"].str.lower() == marque.lower()) 
                        & (df["etat"].str.upper() == state.upper()) 
                        & (df["generation"].str.lower() == gen.lower())
                        & (df["carrosserie"].str.lower() == car.lower())
                        & (df["chevaux_din"] == mot)]
        
        df_sorted["date"] = pd.to_datetime(df_sorted.date, dayfirst=True)
        df_sorted = df_sorted.sort_values("date")
        df2 = df_sorted[['date', 'prix']]
        
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
                                                                        for i in range(last_month -1,last_month + ceil(intervale * 0.3))]))
        future_pred = reg.predict(three_next_months.values.astype("float").reshape(-1, 1))
        df_future = pd.DataFrame()
        df_future["pred"] = future_pred.reshape(-1,)
        df_future["prix"] = future_pred
        df_future["date"] = three_next_months
        df_concat = pd.concat([df2, df_future], sort=True)
        
        ax = df_concat.plot(x='date', y='pred', color='black', linewidth=2)
        ax.set_xlabel('Date')
        ax.set_ylabel('Prix')
        ax.set_ylim((0, max(df_concat.pred) * 1.3))
        ax.plot(df_concat.date, df_concat.pred + df_concat.pred.std(), color='blue', linewidth=2)
        ax.plot(df_concat.date, df_concat.pred - df_concat.pred.std(), color='blue', linewidth=2)
        ax.legend(("pred", "std"))
        path = os.path.join("./frontend/static/frontend/models/",marque.replace(" ", "_"),model.replace(" ", "_"),gen.replace(" ", "_"),car.replace(" ", "_"),state,str(mot),self.protected_encrypted)
        if not os.path.isdir(path): os.makedirs(path)
        plt.tight_layout()
        plt.savefig(os.path.join(path, "regression.svg"))
        plt.clf()
    
    def meanPriceByMonthPlt(self, marque, model, state, gen, car, df):
        df_sorted = df[(df["prix"] != "NC")
                        & (df["prix"].notna())
                        & (df["modele"].str.upper() == model.upper()) 
                        & (df["marque"].str.upper() == marque.upper())
                        & (df["generation"].str.upper() == gen.upper())
                        & (df["etat"].str.upper() == state.upper())
                        & (df["carrosserie"].str.upper() == car.upper())]
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
                csv_df.columns.append(pd.Index([str(int(cv)) + " cv"]))
                
                for i in range(len(dates)):
                    csv_df.loc[i, str(int(cv)) + " cv"] = dates.iloc[i].prix
        csv_df.index = max_dates 
        plt.grid(color='gray', alpha=0.2)
        plt.legend(list_cv)
        plt.xticks(rotation=45)
            
        plt.xlabel("Date")
        plt.ylabel("Prix")
        plt.tight_layout()
        path = os.path.join("./frontend/static/frontend/models/" + marque.replace(" ", "_") + "/" + model.replace(" ", "_") + "/" + gen.replace(" ", "_") + "/" + car.replace(" ", "_") + "/" + state)
        if not os.path.isdir(path): os.makedirs(path)
        plt.savefig(os.path.join(path, "meanPriceByMonth.svg"))
        plt.clf()
        csv_df.to_csv(os.path.join(path, "meanPriceCsv.csv"))
            
        
        
    
    def plotTransmission(self, marque, model, gen, df, getPercentages=False):
        df_sorted = df[(df["modele"].str.lower() == model.lower()) & (df["marque"].str.lower() == marque.lower()) & (df["generation"].str.upper() == gen.upper())]
        labels = ['Automatique', 'Manuelle']
        df_sorted["transmition"] = df_sorted["transmition"].apply(lambda x: 0 if x == "Automatique" else 1)
        percentage = len(df_sorted[df_sorted["transmition"] == 0]) / len(df_sorted["transmition"])
        #percentage = 1 == only automatics
        if percentage != 1 and percentage != 0:
            plt.pie([percentage, 1 - percentage], autopct='%1.1f%%', labels=labels)
        else :
            if percentage == 1:
                plt.pie([percentage],  autopct='%1.1f%%', labels=["Automatique"])
            else :
                plt.pie([percentage + 1],  autopct='%1.1f%%', labels=["Manuelle"])
        if getPercentages:
            return list(zip([percentage, 1-percentage], ["Automatique", "Manuelle"]))
        path = os.path.join("./frontend/static/frontend/models",marque.replace(" ", "_"),model.replace(" ", "_"),gen.replace(" ", "_"))
        plt.tight_layout()
        if not os.path.isdir(path): os.makedirs(path)
        plt.savefig(os.path.join(path, "transmission.svg"))
        plt.clf()
    
    def plotMotor(self, marque, model, gen, df, getPercentages=False):
        df_sorted = df[(df["modele"].str.lower() == model.lower())
                        & (df["marque"].str.lower() == marque.lower())
                        & (df["energie"] != "-") & (df["energie"].notna())
                        & (df["generation"].str.upper() == gen.upper())]
        if len(df_sorted):
            labels = ['Essence', 'Diesel', 'GPL', 'Hybride', 'Electrique', "Autres"]
            df_sorted["energie"] = df_sorted["energie"].apply(lambda x: 0 if x.lower() == "essence" else 1 if x.lower() == "diesel" else 2 if x.lower() == "gpl" else 3 if x.lower() == "hybride" else 4 if x.lower()=="electrique" or x.lower() == "électrique" else 5)
            percentage_essence = len(df_sorted[df_sorted["energie"] == 0]) / len(df_sorted["energie"])
            percentage_diesel = len(df_sorted[df_sorted["energie"] == 1]) / len(df_sorted["energie"])
            percentage_gpl = len(df_sorted[df_sorted["energie"] == 2]) / len(df_sorted["energie"])
            percentage_hybrid = len(df_sorted[df_sorted["energie"] == 3]) / len(df_sorted["energie"])
            percentage_elec = len(df_sorted[df_sorted["energie"] == 4]) / len(df_sorted["energie"])
            percentage_others = len(df_sorted[df_sorted["energie"] == 5]) / len(df_sorted["energie"])
            positive_percentages = []
            positive_labels = []
            counter = 0
            for i in [percentage_essence, percentage_diesel, percentage_gpl, percentage_hybrid, percentage_elec, percentage_others]:
                
                if i != 0:
                    positive_labels.append(labels[counter])
                    positive_percentages.append(i)
                counter += 1
            if getPercentages:
                return list(zip(positive_labels, positive_percentages))
            plt.pie(positive_percentages, autopct='%1.1f%%', labels=positive_labels)
            plt.tight_layout()
            path = os.path.join("./frontend/static/frontend/models",marque.replace(" ", "_"),model.replace(" ", "_"),gen.replace(" ", "_"))
            if not os.path.isdir(path): os.makedirs(path)
            plt.savefig(os.path.join(path, "energie.svg"))
            plt.clf()
    
    def plotDataVolume(self, marque, modele, generation, df):
        df_sorted = df[(df["marque"].str.lower() == marque.lower()) & (df["modele"].str.lower() == modele.lower()) & (df["generation"].str.lower() == generation.lower())]
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
        plt.grid(color='gray', alpha=0.2)
        plt.xticks(rotation=45)
        plt.xlabel("Date")
        plt.ylabel("Volume")
        plt.tight_layout()

        path = os.path.join("./frontend/static/frontend/models",marque.replace(" ", "_"),modele.replace(" ", "_"),generation.replace(" ", "_"), self.protected_encrypted)
        if not os.path.isdir(path): os.makedirs(path)
        plt.savefig(os.path.join(path, "volume_data.svg"))
        plt.clf()
    
    
    def plotEverything(self):
        df = self.df
        
        
        marques = list(self.df.drop_duplicates(subset=["modele", "marque"]).marque)
        modeles = list(self.df.drop_duplicates(subset=["modele", "marque"]).modele)

        for i in range(len(marques)):
            marque = marques[i]
            modele = modeles[i]
            for state in STATES:
                df_sorted = df[(df["modele"].str.lower() == modele.lower()) & (df["marque"].str.lower() == marque.lower()) & (df["etat"] == state)]
                
                all_gens_df = df_sorted.drop_duplicates(subset="generation")
                all_gens = [i for i in all_gens_df.generation]
                if len(df_sorted):
                    for gen in all_gens:
                        df_by_gen = df_sorted[df_sorted["generation"].str.upper() == gen.upper()]
                        all_carr = [i for i in df_by_gen.drop_duplicates(subset=["carrosserie"]).carrosserie]
                        
                        for car in all_carr:
                            df_by_carr = df_by_gen[df_by_gen["carrosserie"].str.upper() == car.upper()]
                            print("Plotting 'mean price by month' for " + marque + " " + modele + " for state " + state + " for gen " + gen + " for car " + car)
                            self.meanPriceByMonthPlt(marque, modele, state, gen, car, df_by_carr)
                            plt.close(plt.gcf())
                            print("Done.")
                            all_mot = [i for i in df_by_gen.drop_duplicates(subset=["chevaux_din"])["chevaux_din"]]
                            for mot in all_mot:
                                df_by_mot = df_by_carr[df_by_carr["chevaux_din"] == mot]
                                print("Plotting 'regression' for " + marque + " " + modele + " for state " + state + " for gen " + gen + " for motor " + str(mot))
                            
                                try:
                                    self.predictModel(marque, modele, state, gen, car, mot, df_by_mot)
                                    plt.close(plt.gcf())
                                    print("Done.")
                                except ValueError:
                                    print("Not enough data for regression with this model")
                        
                        print("Plotting transmission for " + marque + " " + modele + " " + gen)
                        self.plotTransmission(marque, modele, gen, df[(df["modele"].str.lower() == modele.lower()) & (df["marque"].str.lower() == marque.lower())])
                        plt.close(plt.gcf())
                        print("Plotting motor for " + marque + " " + modele + " " + gen)
                        self.plotMotor(marque, modele, gen, df[(df["modele"].str.lower() == modele.lower()) & (df["marque"].str.lower() == marque.lower())])
                        plt.close(plt.gcf())
                        print("Plotting volume for " + marque + " " + modele + " " + gen)
                        self.plotDataVolume(marque, modele, gen, df[(df["modele"].str.lower() == modele.lower()) & (df["marque"].str.lower() == marque.lower())])
                        plt.close(plt.gcf())
                        print("Making pdf data for " + marque + " " + modele + " " + gen)
                        self.makePdf(marque, modele, gen)
                        
    
    def percentageVartiation(self, marque, model, generation, df=0, car="*", mot="*", days_variation=120):
        if type(df) == int:
            df = self.df
        df = df[(df["modele"].str.lower() == model.lower())
              & (df["marque"].str.lower() == marque.lower())
              & (df["generation"].str.lower() == generation.lower())]
        if mot != "*":
            df = df[(df["chevaux_din"] == mot)]
        if car != "*":
            df = df[(df["carrosserie"].str.lower() == car.lower())]
        df.date = pd.to_datetime(df.date, dayfirst=True)
        today = datetime.date.today()
        today_minus_one_month = today - datetime.timedelta(days=30)
        today_minus_three_months = today - datetime.timedelta(days=days_variation)
        today_minus_four_months = today - datetime.timedelta(days=days_variation+30)
        mean_last_month = df[(df["date"] >= today_minus_one_month.strftime("%Y-%m-%d"))].prix.mean()
        mean_three_month_ago = df[(df["date"] >= today_minus_four_months.strftime("%Y-%m-%d"))
                                 & (df["date"] <= today_minus_three_months.strftime("%Y-%m-%d"))].prix.mean()
        
        if not isnan(mean_three_month_ago) and not isnan(mean_last_month):
            percentage = mean_last_month / mean_three_month_ago
        else : 
            percentage = -1
        
        return percentage


    def zipCodes(self, model, marque, gen="*", car="*", mot="*"):
        df = self.df[(self.df["modele"].str.lower() == model.lower()) & (self.df["marque"].str.lower() == marque.lower())]
        
        if gen != "*":
            df = df[df["generation"].str.lower() == gen.lower()]
        
        if car != "*":
            df = df[df["carrosserie"].str.lower() == car.lower()]
        
        if mot != "*":
            df = df[df["chevaux_din"].astype('float') == float(mot)]
        zipcodes = df["code postal"].astype("str")
        df["code postal"] = zipcodes.apply(lambda x: "0"+x[0]+"_"+x[1:] if len(x) < 5
                                                    else x[0:2] + "_" + x[2:] if len(x) == 5
                                                    else x[0:2] + "_" + x[2:5] if len(x) > 5
                                                    else x)
        
        result = list(df[(df["modele"].str.lower() == model.lower()) & (df["marque"].str.lower() == marque.lower())]["code postal"].apply(
            lambda x:
             x.split("_")[0] if int(x.split("_")[0]) < 97 and x.split("_")[0] != "20"
             else  x.split("_")[0] + x.split("_")[1][0] if x.split("_")[0] != "20"
             else "2A" if int(x.split("_")[1]) < 200
             else "2B"))
        return result
    
    def meanPriceByZipcodes(self, model, marque, gen="*", car="*", mot="*"):
        df = self.df
        if gen != "*":
            df = df[df["generation"].str.lower() == gen.lower()]
        if car != "*":
            df = df[df["carrosserie"].str.lower() == car.lower()]
        if mot != "*":
            df = df[df["chevaux_din"].str.lower() == mot.lower()]
        df["code postal"] = df["code postal"].astype("str")
        zipcodes_dpt = set(self.zipCodes(model, marque, gen, car))
        mean_prices = []
        df_sorted = df[(df.modele.str.lower() == model.lower()) & (df.marque.str.lower() == marque.lower())]
        for i in zipcodes_dpt:
            if len(i) == 2:
                df_sorted_zipcode = df_sorted[df_sorted["code postal"].str[0:2] == i]
                if not len(df_sorted_zipcode):

                    if i == "2A":
                        df_sorted_zipcode = df_sorted[(df_sorted["code postal"].str[0:3] == "201") | (df_sorted["code postal"].str[0:3] == "200")]
                    elif i == "2B":
                        df_sorted_zipcode = df_sorted[(df_sorted["code postal"].str[0:3] == "202")]
                    if i[0] == "0":
                        df_sorted_zipcode = df_sorted[(df_sorted["code postal"].str[0] == i[1])]
                mean_prices.append(round(df_sorted_zipcode.prix.mean(), 2))
            elif len(i) == 3:
                df_sorted_zipcode = df_sorted[df_sorted["code postal"].str[0:3] == i]
                mean_prices.append(round(df_sorted_zipcode.prix.mean(), 2))
        return list(zip(zipcodes_dpt, mean_prices))
    
    def getItemDir(self, string):
        item = self.query(" ".join(string.split("_")), "generation")
        return os.path.join("./frontend/static/frontend/models/",item.marque.iloc[0].replace(" ", "_"),item.modele.iloc[0].replace(" ", "_"),item.generation.iloc[0].replace(" ", "_"),self.encrypted_pdf)
