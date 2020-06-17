import React, { Component } from 'react';
import AddItem from './AddItem.js';
import CompareView from './CompareView.js';
import ItemManager from './ItemManager.js';


export class Comparator extends Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            vues: {},
            favs: [],
            selected_vue: 0,
            del_first_click: false,
            add_item_name: "",
            has_loaded: false,
            item_manager_in_place: false,
        };
    }
    componentDidMount(){
        this._isMounted = true;
        document.getElementsByClassName("header")[0].style.animation = "0.3s header-hide forwards";
        document.getElementById("compare-button-hd").style.display = "none";
        fetch('getCompareView')
        .then(res=>res.json())
        .then((results)=>{
            if(this._isMounted){
            this.setState({
                vues: results.vues,
                favs: results.favorites,
                has_loaded: true,
            });
            try{
                this.selectVue("0", 0);
            } catch (e) {}
        }})
    }
    componentWillUnmount(){
        document.getElementsByClassName("header")[0].style.animation = "0.3s header-deploy forwards";
        document.getElementById("compare-button-hd").style.display = "inline-block";
        this._isMounted = false;
    }
    addView(e){
        e.preventDefault();
        fetch('/addCompareView?name='+document.getElementsByName("new-view-name")[0].value)
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                vues: results.new_view,
            });
        });
        
    }
    quitAddView(){
        document.getElementById("item-pannel").style.display = "none";
        this.setState({add_item_name: ""});
    }
    viewItemManage(){
        if(Object.keys(this.state.vues).length){
            const item = document.getElementById("favs-select-list").value;
            if (item != "Liste des favoris"){
                this.setState({
                    add_item_name: item,
                });
                const item_pannel = document.getElementById("item-pannel");
                item_pannel.style.display = "block";
            } else {
                this.alertError("Veuillez séléctionner un modèle");
            }
        } else if(!Object.keys(this.state.vues).length) {
            this.alertError("Vous n'avez aucune vue");
        }
    }
    addItemIntoVue(item, vue){
        if(this.state.vues[vue].items.length < 5){
            fetch('addItemIntoView?item='+item+'&vue_id='+vue)
            .then(res=>res.json())
            .then((results)=>{
                let parsed_item = JSON.parse(item);
                parsed_item.url = results.url;
                let new_vue = this.state.vues;
                new_vue[vue].items.push(parsed_item);
                this.setState({vues: new_vue});
            })
        } else {
            this.alertError("Une vue ne peut avoir que 4 éléments.<br/> Veuillez en supprimer un si vous souhaitez modifier cette vue.");
        }
        
    }
    selectVue(vue, step){
        document.getElementsByClassName("compare-active")[0].nextElementSibling.style.display = "none";
        try{
            document.getElementsByClassName("compare-active")[0].className = "compare-unactive";
        } catch (e) {}
        
        const element = document.getElementById(vue);
        element.className = "compare-active";
        this.setState({
            selected_vue: vue
        });
        document.getElementsByClassName("compare-view-items")[step].style.display = "block";
        const compare_view = document.getElementById("compare-view");
        
    }
    renameViewClick(){
        const input_rename = document.createElement("input");
        input_rename.name = "view-name";
        input_rename.value = document.getElementById("view-name-text").innerHTML;

        const input_valid = document.createElement("button");
        input_valid.innerHTML = "Valider";
        input_valid.onclick = (e)=>this.renameView(e);

        const form_rename = document.createElement("form");
        form_rename.appendChild(input_rename);
        form_rename.appendChild(input_valid);
        
        const parent = document.getElementById("view-name-compare");
        parent.innerHTML = "";
        parent.appendChild(form_rename);
        
    }
    renameView(e){
        e.preventDefault();
        let new_name = document.getElementsByName("view-name")[0].value;
        fetch('/renameView?view='+this.state.selected_vue+'&name='+new_name)
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                vues: results.new_view,
            });
            const view_name_compare = document.getElementById("view-name-compare");
            view_name_compare.innerHTML = "";
            
            const view_name_text = document.createElement("span");
            view_name_text.id = "view-name-text";
            view_name_text.innerHTML = this.state.vues[this.state.selected_vue].name;

            const btn_container = document.createElement("span");

            const btn_rename = document.createElement("button");
            btn_rename.onclick = ()=>this.renameViewClick();
            btn_rename.innerHTML = "Renommer";

            const btn_delete = document.createElement("button");
            btn_delete.id = "delete-btn";
            btn_delete.onclick = ()=>this.deleteView();
            btn_delete.innerHTML = "Supprimmer";

            const btn_look_items = document.createElement("button");
            btn_look_items.id = "items-view-list-management-btn";
            btn_look_items.innerHTML = "Voir les items";
            btn_look_items.onclick = ()=>this.popItemManager();

            btn_container.appendChild(btn_rename);
            btn_container.appendChild(btn_delete);
            btn_container.appendChild(btn_look_items);

            view_name_compare.appendChild(view_name_text);
            view_name_compare.appendChild(btn_container);

        })
    }
    deleteView(){
        if (!this.state.del_first_click){
            document.getElementById("delete-btn").innerHTML = "Cliquez encore pour supprimmer";
            this.setState({del_first_click: true});
        } else {
            fetch('/deleteView?view='+this.state.selected_vue);
            delete this.state.vues[this.state.selected_vue];
            this.setState({
                selected_vue: "",
            });
        }
    }
    makeUrl(item){
        fetch('/getModelUrl?item='+item)
        .then(res=>res.json())
        .then((results)=>{
            return results.url + "/" + this.formatGraphType(item.split(":")[item.split(":").length - 1])
        });
    }
    formatGraphType(str){
        switch(str){
            case 'Prix moyen':{
                return 'meanPriceByMonth.svg';
                break;
            } case 'Régréssion':{
                return 'regression.svg';
                break;
            } case 'Volume (Données)':{
                return 'volume_data.svg';
                break;
            } case 'Volume (Énergie)':{
                return 'energie.svg';
                break;
            } case 'Volume (Transmition)':{
                return 'transmission.svg';
                break;
            }
        }
    }
    alertError(msg){
        const container = document.getElementById("msg-alert");
        container.innerHTML = msg;
        container.style.display = "block";
        container.style.animation = "0.5s fadein forwards";
        setTimeout(()=>{
            container.style.animation = "0.5s fadeout forwards";
            setTimeout(()=>{
                container.style.display = "none";
            }, 500);
        }, 3000);
    }
    popItemManager(){
        document.getElementById("item-manager").style.display = "block";
    }
    newItemPosition(item_number, new_pos){
        let vue = this.state.selected_vue;
        fetch('/modifyItemPos?vue='+vue+'&new_pos='+new_pos+'&item='+item_number)
        .then(res=>res.json())
        .then((results)=>{
            let new_vue = this.state.vues;
            new_vue[vue].items[item_number].pos = this.formatPosition(new_pos);
            this.setState({vues: new_vue});
        });
    }
    formatPosition(pos){
        if (pos == "0-0"){
            return [0,0]
        } else if (pos == "0-1"){
            return [0,1]
        } else if (pos == "1-0"){
            return [1,0]
        } else if (pos == "1-1"){
            return [1,1]
        }
    }
    deleteItem(item){
        fetch('/deleteItem?vue='+this.state.selected_vue+'&item='+item);
        let new_vue = this.state.vues;
        delete new_vue[this.state.selected_vue].items[item];
        this.setState({vues: new_vue, has_loaded: false});
        this.setState({has_loaded: true});
    }
    render() {
        return (
            <div id="compare-frame">
                <div id="msg-alert"></div>
                <a onClick={()=>this.props.goBack()} id="quit-compare-btn">X</a>
                <div id="compare-view">
                    {this.state.has_loaded ? 
                        <CompareView items={this.state.vues[this.state.selected_vue].items} format={(str)=>this.formatGraphType(str)}/> : ""
                    }
                    
                </div>
                <div id="item-pannel">
                    {this.state.add_item_name.length && Object.keys(this.state.vues).length ?
                    <AddItem vues={this.state.vues} item={this.state.add_item_name} addItemIntoView={(item, vue)=>this.addItemIntoVue(item, vue)} quitView={()=>this.quitAddView()}/> : ""
                    }
                </div>
                <div id="compare-manage-pannel">
                    <span id="compare-manage-add-item">
                        <select default="Liste des favoris" id="favs-select-list">
                            <option value="Liste des favoris">Liste des favoris</option>
                            {this.state.favs.map((item, step)=>(
                                <option key={step}>{item.replace("slashcharacter001", "/")}</option>
                            ))}
                        </select><br/>
                        <button onClick={()=>this.viewItemManage()}>Ajouter à la vue</button>
                    </span>
                    <form id="create-view-form">
                        Ajouter une vue : <br/>
                        <input name="new-view-name" placeholder="Nom de la vue"/>
                        <button onClick={(e)=>this.addView(e)}>Créer</button>
                    </form>
                    <div id="compare-view-list">
                        <ul>
                            {Object.keys(this.state.vues).map((item, step)=>(
                                <span key={step}>
                                    <li className={step != 0 ? "compare-unactive" : "compare-active"} id={item} onClick={()=>this.selectVue(item, step)}>
                                        {this.state.vues[item].name}
                                    </li>
                                    <ul className="compare-view-items">
                                        {this.state.vues[item].items.map((i, step)=>(
                                            <li key={step}>
                                                {i.type + " : " + i.name.split(":").join(" / ")}
                                            </li>
                                        ))}
                                    </ul>
                                </span>
                            ))}
                        </ul>
                    </div>
                </div>
                <div id="compare-manage-view">
                    <p>
                        
                        {Object.keys(this.state.selected_vue).toString().length ?
                            (<span id="view-name-compare">
                                <span id="view-name-text">{this.state.vues[this.state.selected_vue].name}</span>
                                <span>
                                    <button onClick={()=>this.renameViewClick()} id="rename-btn">Renommer</button>
                                    <button id="delete-btn" onClick={()=>this.deleteView()}>Supprimmer</button>
                                    <button id="items-view-list-management-btn" onClick={()=>this.popItemManager()}>Voir les items</button>
                                </span>
                            </span>)
                            :
                            "Séléctionnez une vue dans la partie gauche de la page"
                        }
                        
                        
                    </p>

                </div>
                <div id="item-manager">
                    {this.state.has_loaded ? 
                    <ItemManager 
                        items={this.state.vues[this.state.selected_vue].items}
                        newItemPosition={(item_number, new_pos)=>this.newItemPosition(item_number, new_pos)}
                        deleteItem={(item)=>this.deleteItem(item)}
                    /> : ""
                    }
                </div>
                
            </div>
        )
    }
}

export default Comparator
