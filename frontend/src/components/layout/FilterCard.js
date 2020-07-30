import React, { Component } from 'react'

export class FilterCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            gen_list: [],
            selected_carr: "*",
        };
        
    }
    componentDidUpdate(){
        
        this.state.gen_list = Object.keys(this.props.itemObject);
        document.getElementById("select-map-filter-carr").innerHTML = `
        <option name="head-filter" value="*">
            Séléctionnez le type de carrosserie du véhicule
        </option>
        <option value="*">Toutes les carrosseries</option>`;
        
        this.mapCarrOptions();
        
    }
    mapCarrOptions(){
        this.state.gen_list.map((item)=>{
            let option = document.createElement("option");
            option.value = item;
            option.innerHTML = item.split("_").join(" ");
            document.getElementById("select-map-filter-carr").appendChild(option);
        });
    }
    
    filterzipcodes(e){
        e.preventDefault();
        const regex = /^\d+$/;
        let date_value = document.getElementById("input-map-filter-date").value;
        let carr_value = document.getElementById("select-map-filter-carr").value;
        if(regex.test(date_value)){
            this.props.filterzip(carr_value, date_value);
        } else if(!date_value.length){
            this.props.filterzip(carr_value, 90);
        } else {
            const alert_error = document.createElement("p");
            alert_error.innerHTML = "Le nombre de jours est incorrect";
            alert_error.style.color = "red";
            const filter_container = document.getElementById("filter-card");
            filter_container.appendChild(alert_error);
            setTimeout(()=>{
                filter_container.removeChild(alert_error);
            }, 2000);
        }
    }
    render() {
        return (
            <div id="filter-card">
                <form id="filter-map-form">
                <select id="select-map-filter-carr">
                    <option name="head-filter" value="*">
                        Séléctionnez le type de carrosserie du véhicule
                    </option>
                </select>
                <input id="input-map-filter-date" placeholder="Nombre de jours" maxLength="6"/>
                <button onClick={(e)=>this.filterzipcodes(e)}>Filtrer</button>
                </form>
                <p>{this.props.actual_filter}</p>
            </div>
        )
    }
}

export default FilterCard
