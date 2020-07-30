import React, { Component } from 'react'

export class InfosBulles extends Component {
    constructor(props){
        super(props);
        this.textList = [<p>
            Évolution de la moyenne de prix calculée chaque mois et classée par kilométrage et carrosserie.
        </p>, <p>
            En noir, régréssion linéaire et prédiction à 30% de l'échelle de temps sur l'ensemble des données.<br/>
            En bleu, écart-type de la régréssion : 68.27% des valeurs sont comprises dans l'écart-type.
        </p>, <p>
            Répartition des prix moyens par départements. Les données sont calculées sur les 3 derniers mois.
        </p>, <p>
            Répartition et proportion du volume de vente par département. Les données sont calculées sur les 3 derniers mois.
        </p>, <p>
            Pourcentage de variation sur les x derniers jours.
        </p>, <p>
            Évolution du volume de l'offre.
        </p>, <p>
            Répartition de l'offre par boîte de vitesse et par type de carburant.
        </p>, <p>
            Répartition de l'offre par boîte de vitesse.
        </p>, <p>
            Répartition de l'offre par type de carburant.
        </p>, <p>
            Répartition et proportion des prix moyens par départements et du volume de vente par département. Les données sont calculées sur les 3 derniers mois.
        </p>];
        this.state = {
            text: this.switchOnType(),
        }
    }
    componentDidMount(){
        const info_bulle = document.getElementById("main-info-bulle");
        
        var e = this.props.event;
        info_bulle.style.top = e.clientY + "px";
        info_bulle.style.left = e.clientX +"px";
        
    }
    switchOnType(){
        switch(this.props.type){
            case "Prix moyen":{
                return this.textList[0];
            } case "Régréssion":{
                return this.textList[1];
            } case "Prix moyen par département":{
                return this.textList[2];
            } case "Volume par département":{
                return this.textList[3];
            } case "Variation":{
                return this.textList[4];
            } case "Offre (volume)":{
                return this.textList[5];
            } case "Offre (détail)":{
                return this.textList[6];
            } case "Volume (Énergie)":{
                return this.textList[7];
            } case "Volume (Transmition)":{
                return this.textList[8];
            } case "Carte":{
                return this.textList[9];
            }
        }
    }
    render() {
        
        return (
            <div id="main-info-bulle">
                {this.state.text}
            </div>
        )
    }
}

export default InfosBulles
