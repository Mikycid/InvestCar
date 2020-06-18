import React, { Component } from 'react'

export class AddItem extends Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            graphs: {},
            item: {},
        }
        this.item = {
            'name':'',
            'pos': [0,0],
            'url': '',
            'type': '',
        }
    }
    componentDidMount(){
        this._isMounted = true;
        fetch('/getModelDatasComparator?modele='+this.props.item.replace("/", "slashcharacter001"))
        .then(res=>res.json())
        .then((results)=>{
            if(this._isMounted){
            this.setState({
                graphs: results.graphs,
            });
        }});
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    makeForm(type){
        const parent = document.getElementById("add-things-here");
        const select_carr = document.createElement("select");
        select_carr.name = "select_carr";
        const carr_option = document.createElement("option");
        carr_option.innerHTML = "Séléctionnez une carrosserie";
        select_carr.appendChild(carr_option);
        Object.keys(this.state.graphs).map((item, step)=>{
            let option = document.createElement("option");
            option.innerHTML = item.replace("slashcharacter001", "/");
            option.value = item;
            select_carr.appendChild(option);
        });
        parent.appendChild(select_carr);
        select_carr.onchange =  (e)=>{
            const select_state = document.createElement("select");
            select_state.name = "select_state";
            const base_option = document.createElement("option");
            base_option.innerHTML = "Séléctionnez un état";
            select_state.appendChild(base_option);
            Object.keys(this.state.graphs[e.target.value]).map((item)=>{
                let option = document.createElement("option");
                option.innerHTML = item;
                option.value = item;
                select_state.appendChild(option);
            });
            parent.appendChild(select_state);
            select_state.onchange = (evt)=>{
                if(type == "meanprice"){
                    const validate_btn = document.createElement("button");
                    validate_btn.innerHTML = "Valider";
                    validate_btn.onclick = (evt)=>{
                        evt.preventDefault();
                        let datas = this.props.item + ":" + document.getElementsByName("select_carr")[0].value + ":" + document.getElementsByName("select_state")[0].value;
                        let vue = document.getElementsByName("select_vue")[0].value;
                        this.item.name = datas;
                        this.props.addItemIntoView(JSON.stringify(this.item), vue);
                    }
                    parent.appendChild(validate_btn);
                } else if (type == "reg") {
                    const select_cv = document.createElement("select");
                    select_cv.name = "select_cv";
                    const cv_base_option = document.createElement("option");
                    cv_base_option.innerHTML = "Séléctionnez un moteur";
                    select_cv.appendChild(cv_base_option);
                    Object.keys(this.state.graphs[e.target.value][evt.target.value]).map((item)=>{
                        let option = document.createElement("option");
                        option.innerHTML = item;
                        option.value = item;
                        select_cv.appendChild(option);
                    });
                    parent.appendChild(select_cv);
                    select_cv.onchange = (evt)=>{
                        const validate_btn = document.createElement("button");
                    validate_btn.innerHTML = "Valider";
                    validate_btn.onclick = (evt)=>{
                        evt.preventDefault();
                        let datas = this.props.item + ":" + document.getElementsByName("select_carr")[0].value + ":" + document.getElementsByName("select_state")[0].value + ":" + document.getElementsByName("select_cv")[0].value;
                        let vue = document.getElementsByName("select_vue")[0].value;
                        this.item.name = datas;
                        this.props.addItemIntoView(JSON.stringify(this.item), vue);
                    }
                    parent.appendChild(validate_btn);
                    }
                }
            }
        }
    }
    handleDataSelect(e){
        const parent = document.getElementById("add-things-here");
        parent.innerHTML = "";
        this.item.type = e.target.value;
        switch(e.target.value){
            case "Prix moyen":{
                this.makeForm("meanprice");
                break;
            } case "Régréssion":{
                this.makeForm("reg");
                break;
            } case "Carte":{
                const map_type_select = document.createElement("select");
                map_type_select.name = "map_type_select";
                const base_map_option = document.createElement("option");
                base_map_option.innerHTML = "Séléctionnez le type de carte";
                base_map_option.value = -1
                
                const meanprice_option = document.createElement("option");
                meanprice_option.innerHTML = "Prix moyen par département";

                const volume_option = document.createElement("option");
                volume_option.innerHTML = "Volume par département";

                map_type_select.appendChild(base_map_option);
                map_type_select.appendChild(meanprice_option);
                map_type_select.appendChild(volume_option);
                map_type_select.onchange = (e)=>{
                    if (e.target.value != -1){
                        const validate_map_btn = document.createElement("button");
                        validate_map_btn.innerHTML = "Valider";
                        validate_map_btn.onclick = (evt)=>{
                            evt.preventDefault();
                            this.item.name = this.props.item + ":" +e.target.value;
                            let vue = document.getElementsByName("select_vue")[0].value;
                            this.props.addItemIntoView(JSON.stringify(this.item), vue);
                        }
                        parent.appendChild(validate_map_btn);
                    }
                }
                parent.appendChild(map_type_select);
                break;
            } case "Variation":{
                const validate_variation_btn = document.createElement("button");
                validate_variation_btn.innerHTML = "Valider";
                validate_variation_btn.onclick = (evt) =>{
                    evt.preventDefault();
                    this.item.name = this.props.item;
                    let vue = document.getElementsByName("select_vue")[0].value;
                    this.props.addItemIntoView(JSON.stringify(this.item), vue);
                }
                parent.appendChild(validate_variation_btn);
                break;
            } case "Volume (Données)":{
                const validate_data_volume_btn = document.createElement("button");
                validate_data_volume_btn.innerHTML = "Valider";
                validate_data_volume_btn.onclick = (evt) =>{
                    evt.preventDefault();
                    this.item.name = this.props.item;
                    let vue = document.getElementsByName("select_vue")[0].value;
                    this.props.addItemIntoView(JSON.stringify(this.item), vue);
                }
                parent.appendChild(validate_data_volume_btn);
                break;
            } case "Volume (Énergie)":{
                const validate_volume_btn = document.createElement("button");
                validate_volume_btn.innerHTML = "Valider";
                validate_volume_btn.onclick = (evt) =>{
                    evt.preventDefault();
                    this.item.name = this.props.item;
                    let vue = document.getElementsByName("select_vue")[0].value;
                    this.props.addItemIntoView(JSON.stringify(this.item), vue);
                }
                parent.appendChild(validate_volume_btn);
                break;
            } case "Volume (Transmition)":{
                const validate_volume_btn = document.createElement("button");
                validate_volume_btn.innerHTML = "Valider";
                validate_volume_btn.onclick = (evt) =>{
                    evt.preventDefault();
                    this.item.name = this.props.item;
                    let vue = document.getElementsByName("select_vue")[0].value;
                    this.props.addItemIntoView(JSON.stringify(this.item), vue);
                }
                parent.appendChild(validate_volume_btn);
                break;
            }
        }
    }
    render() {
        const items = ["Prix moyen", "Régréssion", "Carte", "Variation", "Volume (Données)", "Volume (Énergie)", "Volume (Transmition)", "Informations"];
        return (
            <div id="compare-add-item">
                <h3>{this.props.item}</h3>
                <form id="form-add-item">
                    <select name="select_vue">
                        {Object.keys(this.props.vues).map((item, step)=>(
                            <option key={step} value={item}>{this.props.vues[item].name}</option>
                        ))}
                    </select>
                    <select onChange={(e)=>this.handleDataSelect(e)} name="select_data_type">
                        <option>Séléctionnez un type de données à afficher</option>
                        {items.map((item, step)=>(
                            <option key={step}>{item}</option>
                        ))}
                    </select>
                    <div id="add-things-here">

                    </div>
                </form>
                <button onClick={()=>this.props.quitView()} id="quit-add-item-btn">Quitter</button>
            </div>
        )
    }
}

export default AddItem
