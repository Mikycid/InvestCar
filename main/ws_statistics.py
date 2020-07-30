import os
import pickle
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import time
import datetime
import statistics

class WS_Statistics():
    """Une classe qui va enregistrer les données importantes"""
    
    def __init__(self):
        try:
            self.connexion_logs = pd.read_csv('data/connexion_logs.csv')
        except:
            self.connexion_logs = pd.DataFrame(columns=["ip", "date"])

        self.connexion_logs["date"] = pd.to_datetime(self.connexion_logs["date"])
        self.nb_connexion = len(self.connexion_logs)
        
    def newVisitor(self, ip):
        self.connexion_logs = self.connexion_logs.append(pd.DataFrame([[ip, datetime.datetime.now()]], columns=["ip", "date"]))
        self.connexion_logs.to_csv('data/connexion_logs.csv', index=False)

    def mean_connexion_by_day(self):
        list_by_day = []
        dates = list(set(list(self.connexion_logs["date"])))

        for i in range(len(dates)):
            connexions_this_day = self.connexion_logs[self.connexion_logs["date"].dt.strftime("%Y/%m/%d") == dates[i].strftime("%Y/%m/%d")]
            list_by_day.append(len(connexions_this_day))
        return statistics.mean(list_by_day)


        
    