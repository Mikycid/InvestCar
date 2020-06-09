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
        <option name="head-filter">
            Séléctionnez le type de carrosserie du véhicule
        </option>`;
        
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
    
    
    changeCarr(e){
        this.state.selected_gen = e.target.value;
        this.mapCarrOptions();

        document.getElementsByName("head-filter")[0].disabled = "disabled";
    }
    
    render() {
        return (
            <div id="filter-card">
                <form>
                <select id="select-map-filter-carr" onChange={(e)=>this.changeCarr(e)}>
                    <option name="head-filter">
                        Séléctionnez la génération du véhicule
                    </option>
                </select>
                
                <button onClick={()=>this.props.filterzip(this.state.selected_carr)}>Filtrer</button>
                </form>
                
            </div>
        )
    }
}

export default FilterCard
