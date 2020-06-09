Pour installer les dépendences :
Pour installer le projet : créez un environnement virtuel avec python3 -m venv venv
Il vous faudra django comme backend(obligatoire) et si vous allez faire du frontend vous aurez besoin de npm (react)
Placez vous dans le dossier principal du projet, tapez pip install -r requirements.txt
Placez vous ensuite dans le dossier frontend et tapez npm install
Pour lancer le serveur, placez vous dans votre environnement virtuel avec source venv/bin/activate dans le dossier principal du projet, puis il faut taper : python manage.py runserver
Pour le compilateur javascript il est automatiquement configuré, après avoir fait un npm install (la première fois) placez vous dans le dossier frontend avec une console et tapez npm run dev

Tout ce qui est du code python se trouve dans les dossiers data, main, et auto_stats
Pour ce qui est du frontend, le design (css) est dans le dossier frontend/static/css/
Le javascript (react) dans frontend/src/
Le fichier main html(normalement il n'y a pas à le modifier) il se trouve dans templates/frontend/

