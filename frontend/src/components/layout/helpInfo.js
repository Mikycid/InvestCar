import React, { Component } from 'react'

export class HelpInfo extends Component {
    render() {
        return (
            <div id="helpInfo">
                <span>Code couleur :</span>
                <span className="c-5000km">&#60;5000km</span>
                <span className="c-50000km">&#60;50000km</span>
                <span className="c-150000km">&#60;150000km</span>
                <span className="c-250000km">&#60;250000km</span>
                <span className="c-250000mkm">250000+km</span>
                <span className="calc-info">Les pourcentages sont calculés selon les données du dernier mois par rapport aux données d'il y a 3 mois.</span>
            </div>
        )
    }
}

export default HelpInfo
