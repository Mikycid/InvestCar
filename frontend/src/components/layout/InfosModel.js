import React, { Component } from 'react'

export class InfosModel extends Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.nb_tables = window.innerHeight <= 1100 ? [0,1] : [0,1,2,3]
        this.state = {
            motors: [],
            series: {},
            years: {},
            energy: {},
            couple: {},
            cylindres: {},
            turbo: {},
            vmax: {},
            zero_to_hundred: {},
            injection: {},
            urban_conso: {},
            extra_urban_conso: {},
            selected_motors: [],
        }
    }
    componentDidMount(){
        this._isMounted = true;
        fetch('/getModelInfos?modele='+this.props.item.split(" ").join('_'))
        .then(res=>res.json())
        .then((results)=>{
            if (this._isMounted){
                this.setState({
                    motors: results.motors,
                    series: results.series,
                    years: results.years,
                    energy: results.energy,
                    couple: results.couple,
                    cylindres: results.cylindres,
                    turbo: results.turbo,
                    vmax: results.vmax,
                    zero_to_hundred: results.zero_to_hundred,
                    injection: results.injection,
                    urban_conso: results.urban_conso,
                    extra_urban_conso: results.extra_urban_conso,
                    selected_motors: [results.motors[0], results.motors[1], results.motors[2], results.motors[3]]
                });
        }});
        
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    selectMotor(n, e){
        let new_select = this.state.selected_motors;
        new_select[n] = e.target.value;
        
        this.setState({
            selected_motors: new_select,
        });
    }
    render() {
        return (
            <div id="infos-model-frame">
                <div className="manage-component-frame">
                    <h2>Informations sur le modèle</h2>
                    {this.nb_tables.map((item)=>(
                        
                        <select onChange={(e)=>this.selectMotor(item, e)} key={item} value={this.state.motors[item]}>
                            {this.state.motors.map((item, step)=>(
                                <option key={step}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    ))}
                </div>
                <div className="genview-frame-table-content">
                    {this.nb_tables.map((item)=>(
                        
                            <div className="table-infos-model" key={item}>
                                <ul>
                                    <li className="table-infos-title">{this.state.selected_motors[item]}</li>
                                    <li>Série : {this.state.series[this.state.selected_motors[item]]}</li>
                                    <li>Années de création : {this.state.years[this.state.selected_motors[item]]}</li>
                                    <li>Energie : {this.state.energy[this.state.selected_motors[item]]}</li>
                                    <li>Couple : {this.state.couple[this.state.selected_motors[item]]}</li>
                                    <li>Cylindres : {this.state.cylindres[this.state.selected_motors[item]]}</li>
                                    <li>Turbo ? {this.state.turbo[this.state.selected_motors[item]]}</li>
                                    <li>Vitesse max : {this.state.vmax[this.state.selected_motors[item]]}</li>
                                    <li>Zero à 100 : {this.state.zero_to_hundred[this.state.selected_motors[item]]}</li>
                                    <li>Injection : {this.state.injection[this.state.selected_motors[item]]}</li>
                                    <li>Consommation sur 100km en milieu urbain : <br/> {this.state.urban_conso[this.state.selected_motors[item]]}</li>
                                    <li>Consommation sur 100km en milieu extra urbain : <br/> {this.state.extra_urban_conso[this.state.selected_motors[item]]}</li>
                                </ul>
                            </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default InfosModel
