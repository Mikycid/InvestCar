import React, { Component } from 'react'

export class ModelPercentage extends Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            percentage: -1000,
        }
    }
    
    componentWillUnmount(){
        this._isMounted = false;
    }
    getPercentage(e){
        e.preventDefault();
        fetch('/getPercentageVariation?modele='+this.props.item.split(" ").join('_')+'&days='+e.target.firstElementChild.value)
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                percentage: results.percentage,
            });
        });
    }
    render() {
        return (
            <div id={this.props.from_comp ? "percentage-comp" : "percentage-premium"}>
                <p>Vous pouvez consulter le pourcentage en tapant ici le nombre de jours pour calculer la variation : </p>
                <form onSubmit={(e)=>this.getPercentage(e)}>
                    <input type="text"/><br/><br/>
                    <input type="submit" value="Calculer"/>
                </form>
                {this.state.percentage != -1000 ?
                <span>
                    {this.state.percentage != -1 ? <p className={this.state.percentage > 1 ? "green_percentage" : "red_percentage" }> {String((this.state.percentage * 100 - 100).toFixed(2))} </p> : "Aucune donnée sur cette periode"}
                </span> : <span></span>
                }
            </div>
        )
    }
}

export default ModelPercentage
