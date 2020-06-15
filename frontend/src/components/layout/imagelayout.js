import React, { Component } from 'react'

export class ImageLayout extends Component {
    constructor(props){
        super(props);
        this.state = {
            best_models: [],
            best_percentages: [],
            recordsMenu: true,
        }
    }
    render() {
        return (
            <div id="page_view" className="slide">
                {this.props.images_url ? 
                    <img src={this.props.images_url[this.props.index]} className="background" alt="Image en cours de chargement."/>
                    :
                    <p>Image en cours de chargement.</p>
                }
                <h2 className="main-page-title">Données et aperçu de l'évolution du marché automobile</h2>
                <ul id="top-records">
                    <li>Top records &nbsp;&nbsp;</li>
                    {this.props.best_models.map((item, step)=>(
                        <li key={step} onClick={()=>this.props.switchTab("genview", {item})}>
                            {item.replace('slashcharacter001', '/')} : {(this.props.best_percentages[step] * 100 - 100).toFixed(2)} %
                        </li>
                    ))}
                </ul>
                <div id="main-page-description">
                    <h3>{this.props.best_models[this.props.index]}</h3>
                    <p>Ce modèle a une {this.props.best_percentages[this.props.index] > 1 ? "Augmentation" : "Diminution" } de prix de {this.props.best_percentages[this.props.index] * 100 - 100} % par rapport aux données entre 90 et 120 jours avant aujourd'hui.</p>
                    <p>Ces données sont calculées à titre indicatif, référez vous à la page de ce modèle pour plus d'informations</p>
                </div>
            </div>
        )
    }
}

export default ImageLayout
