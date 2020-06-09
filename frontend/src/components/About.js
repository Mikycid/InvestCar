import React, { Component } from 'react'

export class About extends Component {
    render() {
        return (
            <div className = "a-propos">
                <div id="scroll-position-1">
                <div className="partie1">
                    
                    <h1>
                        L'automobile, l'investissement de demain ? 
                    </h1>
                    <p>   
                        Oubliez l'or, la bourse, l'immobilier et même les hedge funds. Depuis 10 ans, le meilleur placement possible c'est l'automobile et de loin. Évidemment il ne s'agit pas d'investir dans une Clio, une Golf ou une Fiesta. Les automobiles qui prennent de la valeur avec le temps sont celles que les constructeurs vendent cher et produisent en petite quantité. Les Porsche et les Ferrari de collection ont ainsi toutes les chances de prendre une sacrée cote. Selon une étude de Knight Frank Luxury Investment, les chanceux qui ont les moyens d'investir dans des modèles de collection ont bénéficié de rendements hors du commun. De 161% sur 5 ans et même de 467% sur 10 ans. Autrement dit, avec un investissement initial de 50.000 euros en 2006, votre capital serait aujourd'hui de 283.500 euros.  
                    </p>
                    <img src={static_img+"/courbe.jpeg"}></img>
                    <p>
                        Aucun autre type de placement ne peut soutenir la comparaison. Si vous aviez placé la même somme à la Bourse de Londres (l'étude est britannique), votre capital n'aurait pas pris un penny. Et si vous l'aviez confié à un fonds d'investissement, il aurait pris 7,83% selon le spécialiste des données financières Preqin. Même l'immobilier et l'or n'ont pas autant rapporté sur la décennie passée. Pour un investissement dans le centre de Londres, la plus-value se serait limitée à 100% (les prix ont doublé...). Et l'once d'or qui a beaucoup fait le yo-yo depuis dix ans a généré, elle, un rendement de 250%.
                    </p>                  
                </div>

                <div className ="partie2">
                    <h1>
                        Investcar : pionnier de la structuration du marché
                    </h1>
                    <p> 
                        Nous pensons qu'il n'y a pas de budget à la passion automobile. Le plaisir automobile ne doit pas être réservé à une élite. Il suffit à chacun de trouver le véhicule qui lui convient le mieux. Tout investissement nécessite des indicateur. Depuis longtemps nous nous attelons à comprendrendre le marché automobile. C'est ainsi que nous pouvons vous fournir les meilleurs indicateurs vous permettant de faire les meilleurs choix. Quel que soit le budget, l'automobile donne la possibilité d'investir.
                    </p>
                </div>
                <div className = "partie3">
                    <h1>
                        Investcar : une équipe de passionnés
                    </h1>
                    <p>
                        Nous ne voyons pas l'automobile comme un placement financier mais comme une source de plaisir. Faire les bon choix dans l'achat de son véhicule c'est se permettre d'avoir les moyens d'entretenir sont véhicule et ainsi préserver le patrimoine automobile. C'est donner les moyens à chacun de réaliser ses rêves sans crouler sous les factures. Qui n'a jamais rêver de rouler en Porsche, Ferrari ou au volant d'un cabriolet anglais ?
                    </p>
                </div>
                </div>
                <div id="scroll-position-2">
                <div className="partie4">
                    <h1>
                        Une offre qui correspond à vos besoins
                    </h1>
                    <h2>
                        Une offre particulier
                    </h2>
                    <p>
                        Avoir la possibilité d'accéder à tous les véhicules sans restriction et de bénéficier de l'indicateur prix quel que soit le modèle ou la version du véhicule.
                        Vous souhaitez avoir plus de renseigner sur un modèle en particulier. Il vous suffit alors de télécharger le dossier PDF (prix : xx€) et vous pouvez alors accéder à l'ensemble des indicateurs du véhicule.
                        Exemple de PDF si dessous.
                    </p>
                    <h2>
                        Une offre professionnelle
                    </h2>
                    <p>
                        Un accès illimité à tous les indicateurs et à tous les véhicule. La possibilité de créer de nouveaux indicateurs. Pour plus d'information, contactez nous par mail à sales@investcar.fr
                    </p>
                </div>
                </div>
            </div>
        )
    }
}

export default About
