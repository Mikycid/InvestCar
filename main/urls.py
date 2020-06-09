from django.urls import path, include
from . import views
from django.contrib import admin

urlpatterns = [
    path('modelList', views.modelList),
    path('query', views.query),
    path('genView', views.genView),
    path('modelview', views.modelView),
    path('bestPercentages', views.bestPercentages),
    path('filterZipCodes', views.filterZipCodes),
    path('getPercentageVariation', views.getPercentageVartation),
    path('getModelInfos', views.getModelInfos),
    path('connexion', views.connexion),
    path('deconnexion', views.deconnexion),
    path('inscription', views.inscription),
    path('admin/', admin.site.urls),
    path('manageDatabase', views.manageDatabase),
    path('sendFileDatas', views.sendFileDatas),
    path('getMainPercentages', views.getMainPercentages),
    path('isPremium', views.askIfPremium),
    path('getImage', views.getImage),
    path('getEncryptedPdf', views.getEncryptedPdf),
    path('getMainPageImages', views.getMainPageImages),
    path('registerCommand', views.registerCommand),
    path('getUser', views.getUser),
    path('isUserLoggedIn', views.isUserLoggedIn),
    ]