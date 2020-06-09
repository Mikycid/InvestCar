from django.shortcuts import render

def index(requests):
    return render(requests, 'frontend/index.html')
