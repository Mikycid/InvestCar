import React, { Component, PureComponent } from 'react'
import France from '@svg-maps/france.departments'
import { SVGMap } from 'react-svg-map'
import FilterCard from './layout/FilterCard.js'
import ModelPercentage from './layout/modelPercentage.js';
import InfosModel from './layout/InfosModel.js';
import Slider from 'react-slick';

Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            return this.filter(x => x==value).length;
        }
    },
    contains: {
        value: function(value) {
            for(var i=0; i<this.length; i++) {
                if(value === this[i]) {
                    return true;
                }
            }
            return false;
        }
    }
});
export class GenView extends Component {
    constructor(props){
        super(props);
        if (this.props.item == undefined){
            this.props.goBack();
        }
        this._isMounted = false;
        this.ids_list = ["images-model", "graph-prix-moyen", "svg-container", "volume-data", "infos-model", "buy-frame"];
        
        this.state = {
            graphs : {},
            zipcodes: [],
            meanprices: [],
            states: [],
            selected_gen: {},
            selected_carr: {},
            selected_carr_reg: {},
            selected_state: [],
            selected_state_reg: [],
            selected_mot_reg: [],
            selected_graph: "",
            base_url: [],
            url: [],
            url_reg: [],
            motor: [],
            transmition: [],
            datas_motor: [],
            datas_transmition: [],
            url_pie: [],
            percentage1: 0,
            percentage2:0,
            percentage3:0,
            max_volume: 0,
            this_volume: 0,
            is_premium: false,
            images_url: [],
            model: "",
            marque: "",
            generation: "",
            last_index: 0,
            previous_scroll_pos : 0,
            crypted: 0,
            is_fav: false,
        };
        this.slider = 0;
    }
    componentDidMount(){
        this._isMounted = true;
        fetch('/isPremium')
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                is_premium: results.is_premium,
            });
        });
        
        fetch('/genView?modele='+this.props.item.split(" ").join('_'))
        .then(res=>res.json())
        .then((results)=>{
            if (this._isMounted){
                this.setState({
                    graphs: results.graphs,
                    zipcodes: results.zipcodes,
                    meanprices: results.meanprice,
                    url: results.url.split("/"),
                    url_pie: results.url.split("/"),
                    url_reg: results.url.split("/"),
                    base_url: results.url.split("/"),
                    max_volume: results.max_volume,
                    this_volume: results.this_volume,
                    model: results.modele,
                    marque: results.marque,
                    generation: results.generation,
                    crypted: results.crypted,
                });
                this.colorMapWithMeanPriceVolume();
                document.getElementsByClassName("loading")[0].style.animation = "0.8s fadeout ease-out forwards";
                setTimeout(()=>{
                    document.getElementsByClassName("loading")[0].style.display = "none";
                    document.getElementsByClassName("gen-view")[0].style.animation = "0.8s fadein ease-in forwards";
                }, 1000);
            }
        });
        fetch('/isFav?model='+this.props.item)
        .then(res=>res.json())
        .then((results)=>{
            if(this._isMounted){
                this.setState({
                    is_fav: results.is_fav,
                });
        }});
        fetch('/getMainPercentages?modele='+this.props.item.split(" ").join('_'))
        .then(res=>res.json())
        .then((results)=>{
            if(this._isMounted){
                this.setState({
                    percentage1: results.percentage1,
                    percentage2: results.percentage2,
                    percentage3: results.percentage3,
                });
                let percentage_list = document.getElementById("percentage-list").firstElementChild;
                
                percentage_list.style.border = this.state.percentage1 > 1 ? '1px green solid' : '1px red solid';
                percentage_list.style.color = this.state.percentage1 > 1 ? 'green' : 'red';
                percentage_list = percentage_list.nextElementSibling;
                percentage_list.style.border = this.state.percentage2 > 1 ? '1px green solid' : '1px red solid';
                percentage_list.style.color = this.state.percentage2 > 1 ? 'green' : 'red';
                percentage_list = percentage_list.nextElementSibling;
                percentage_list.style.border = this.state.percentage3 > 1 ? '1px green solid' : '1px red solid';
                percentage_list.style.color = this.state.percentage1 > 1 ? 'green' : 'red';
                percentage_list = percentage_list.nextElementSibling;
        }});
        fetch('/getImage?modele='+this.props.item.split(" ").join('_')+'&marque=false')
        .then(res=>res.json())
        .then((results)=>{
            if(this._isMounted){
                this.setState({
                    images_url: results.image,
                });
        }});
        if(!this.props.user.group.includes("Premium") && !this.props.user.group.includes("admin")){
            const premium_items = document.getElementsByClassName("onlyPremium");
            for(let i=0;i<premium_items.length;i++){
                if (premium_items[i].tagName == "OPTION"){
                    premium_items[i].disabled = true;
                } else {
                    premium_items[i].style.display = "none";
                }
            }
        }
        document.onkeydown = (e)=>this.handleKey(e);
        let slickListDiv = document.getElementsByClassName('slick-list')[0]
        slickListDiv.addEventListener('wheel', event => {
          event.preventDefault()
          event.deltaY > 0 ? this.slider.slickNext() : this.slider.slickPrev()
        });
        const slicker = document.getElementsByClassName("scroller-list-component");
        for(let i=0;i<slicker.length;i++){
            slicker[i].onclick = ()=>this.slider.slickGoTo(i);
        }
        document.getElementById("main-title").innerHTML = this.props.item.replace("slashcharacter001", "/");
    }
    
    
    componentWillUnmount(){
        this._isMounted = false;
        document.onkeydown = ()=>{};
        document.getElementById("main-title").innerHTML = "InvestCar"
    }
    filterZipCodes(car){
        fetch('/filterZipCodes?modele='+this.props.item.split(" ").join('_')+'&car='+car)
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                zipcodes: results.zipcodes,
                meanprices: results.meanprice,
            });
            this.changeColor({'target':{'value':document.getElementById("select-map-type").value}});
            
        });
    }
    
    resetMap(){
        for (let i=1;i<95;i++){
            if (i<10){
                document.getElementById("0"+String(i)).style.fill = "black";
                document.getElementById("0"+String(i)).onmouseover = ()=>{};
            } else if (i != 20) {
                document.getElementById(String(i)).style.fill = "black";
                document.getElementById(String(i)).onmouseover = ()=>{};
            } else {
                document.getElementById("2A").style.fill = "black";
                document.getElementById("2A").onmouseover = ()=>{};
                document.getElementById("2B").style.fill = "black";
                document.getElementById("2B").onmouseover = ()=>{};
            }
        }
        
    }
    changeColor(e){
        if (e.target.value == "Volume d'offre par département"){
            this.colorMapWithZipCodesVolume();
        } else {
            this.colorMapWithMeanPriceVolume();
        }
    }
    colorMapWithZipCodesVolume(){
        this.resetMap();
        const overseas = ["Guadeloupe:971", "Guyane:973", "St-Pierre-et-Miquelon:975",
        "Martinique:972", "La Réunion:974", "Mayotte:976",
        "Terres-Australes et Antarctiques:984", "Polynésie Française:987",
        "Wallis-et-Futuna:986", "Nouvelle-Calédonie:988", "Monaco:980"];
        let counter_overseas = [];
        overseas.forEach(()=>counter_overseas.push(0));
        let max_value = 0;
        this.state.zipcodes.map((item)=>{
            if (this.state.zipcodes.count(item) > max_value){
                max_value = this.state.zipcodes.count(item);
            }
        });
        this.state.zipcodes.map((item)=>{
            if (item.length < 3){
                let color = this.state.zipcodes.count(item) / max_value * 255;
                document.getElementById(String(item)).style.fill = "rgb(0,"+color+",0)";
                document.getElementById(String(item)).onmouseover = (e) => {
                    let last_color = document.getElementById(String(item)).style.fill;
                    document.getElementById(String(item)).style.fill = "orange";
                    const tooltip = document.createElement("p");
                    tooltip.innerHTML = "Département n°" + item + " : " + String((this.state.zipcodes.count(item) / max_value * 100).toFixed(2)) + "% du maximum du volume.";
                    tooltip.style.position = "absolute";
                    tooltip.style.textAlign = "center";
                    tooltip.style.width = "150px";
                    tooltip.style.left = event.clientX + window.innerWidth * 3+"px";
                    tooltip.style.top = event.clientY+document.getElementsByClassName("svg-container")[0].offsetTop-20+"px";
                    tooltip.style.font = "12px italic";
                    tooltip.style.backgroundColor = "#888";
                    tooltip.style.borderRadius = "0.8em";
                    tooltip.style.color = "white";
                    tooltip.style.padding = "8px";
                    document.getElementsByClassName("svg-container")[0].appendChild(tooltip);
                    document.getElementById(String(item)).onmouseout = ()=> {
                        document.getElementsByClassName("svg-container")[0].removeChild(tooltip);
                        document.getElementById(String(item)).style.fill = last_color;
                    }
                }
            } else {

                for(let i=0;i<overseas.length;i++){
                    if (overseas[i].split(":")[1] == item){
                        counter_overseas[i] += 1;
                        break;
        }}}});
        
        counter_overseas.map((i, step)=>{
            if(i != 0){
                const node = document.createElement("li");
                node.onmouseover = ()=>{
                    const tooltip = document.createElement("p");
                    tooltip.innerHTML = "Département de " + overseas[step].split(":")[0] + " : " + String((i / max_value * 100).toFixed(2)) + "% du maximum du volume.";
                    tooltip.style.position = "absolute";
                    tooltip.style.textAlign = "center";
                    tooltip.style.font = "12px italic";
                    tooltip.style.left = event.clientX+window.innerWidth * 3 +"px";
                    tooltip.style.top = event.clientY+document.getElementsByClassName("svg-container")[0].offsetTop-20+"px";
                    tooltip.style.backgroundColor = "#888";
                    tooltip.style.borderRadius = "0.8em";
                    tooltip.style.color = "white";
                    tooltip.style.padding = "8px";
                    document.getElementsByClassName("svg-container")[0].appendChild(tooltip);
                    node.onmouseout = ()=> {
                        document.getElementsByClassName("svg-container")[0].removeChild(tooltip);
                }}
                const container = document.getElementById("overseas-list");
                container.innerHTML = "";
                let color = i / max_value * 255;
                node.innerHTML = overseas[step].split(":")[0];
                node.style.backgroundColor = "rgb(0,"+color+",0)";
                container.appendChild(node);
            }
        });
    }
    colorMapWithMeanPriceVolume(){
        this.resetMap();
        const overseas = ["Guadeloupe:971", "Guyane:973", "St-Pierre-et-Miquelon:975",
        "Martinique:972", "La Réunion:974", "Mayotte:976",
        "Terres-Australes et Antarctiques:984", "Polynésie Française:987",
        "Wallis-et-Futuna:986", "Nouvelle-Calédonie:988", "Monaco:980"];
        let counter_overseas = [];
        overseas.forEach(()=>counter_overseas.push(0));
        let max_value = 0;
        let min_value = 0;
        this.state.meanprices.map((item, step)=>{
            if (item[1] > max_value){
                max_value = item[1];
            }
            if (item[1] < min_value || min_value == 0){
                min_value = item[1];
            }
        });
        this.state.meanprices.map((item)=>{
            if (item[0].length < 3){
                let color = (item[1] - min_value) / (max_value - min_value) * 255;
                document.getElementById(String(item[0])).style.fill = "rgb(0,"+color+",0)";
                document.getElementById(String(item[0])).onmouseover = () => {
                    let last_color = document.getElementById(String(item[0])).style.fill;
                    document.getElementById(String(item[0])).style.fill = "orange";
                    const tooltip = document.createElement("p");
                    tooltip.innerHTML = "Département n°" + item[0] + " : " + String((item[1] / max_value * 100).toFixed(2)) + "% du maximum de la moyenne de prix, soit " + item[1] + "&euro;.";
                    
                    tooltip.style.position = "absolute";
                    tooltip.style.textAlign = "center";
                    tooltip.style.width = "150px";
                    tooltip.style.left = event.clientX+window.innerWidth * 3 + "px";
                    tooltip.style.top = event.clientY+document.getElementsByClassName("svg-container")[0].offsetTop-20+"px";
                    tooltip.style.font = "12px italic";
                    tooltip.style.backgroundColor = "#888";
                    tooltip.style.borderRadius = "0.8em";
                    tooltip.style.color = "white";
                    tooltip.style.padding = "8px";
                    document.getElementsByClassName("svg-container")[0].appendChild(tooltip);
                    document.getElementById(String(item[0])).onmouseout = ()=> {
                        document.getElementsByClassName("svg-container")[0].removeChild(tooltip);
                        document.getElementById(String(item[0])).style.fill = last_color;
                    }
                }
            } else {

                for(let i=0;i<overseas.length;i++){
                    if (overseas[i].split(":")[1] == item[0]){
                        counter_overseas[i] = item[1];
                        break;
        }}}});
        counter_overseas.map((i, step)=>{
            if(i != 0){
                const node = document.createElement("li");
                node.onmouseover = ()=>{
                    const tooltip = document.createElement("p");
                    tooltip.innerHTML = "Département de " + overseas[step].split(":")[0] + " : " + String((i / max_value * 100).toFixed(2)) + "% du maximum de la moyenne de prix, soit " + item[1] + "&euro;.";
                    tooltip.style.position = "absolute";
                    tooltip.style.textAlign = "center";
                    tooltip.style.left = event.clientX+ window.innerWidth * 3 + "px";
                    tooltip.style.top = event.clientY+document.getElementsByClassName("svg-container")[0].offsetTop-20+"px";
                    tooltip.style.backgroundColor = "#888";
                    tooltip.style.borderRadius = "0.8em";
                    tooltip.style.font = "12px italic";
                    tooltip.style.color = "white";
                    tooltip.style.padding = "8px";
                    document.getElementsByClassName("svg-container")[0].appendChild(tooltip);
                    node.onmouseout = ()=> {
                        document.getElementsByClassName("svg-container")[0].removeChild(tooltip);
                }}
                const container = document.getElementById("overseas-list");
                container.innerHTML = "";
                let color = (i - min_value) / (max_value - min_value) * 255;
                node.innerHTML = overseas[step].split(":")[0];
                node.style.backgroundColor = "rgb(0,"+color+",0)";
                container.appendChild(node);
            }
        });
    }
    changeCarr(e, reg=false){
        if (e.target.value != "head"){
            if (!reg){
                this.state.url[7] = e.target.value;
                this.setState({
                    selected_carr: this.state.graphs[e.target.value],
                    selected_graph: e.target.value,
                });
                document.getElementsByName("head")[0].disabled = "disabled";
            } else {
                this.state.url_reg[7] = e.target.value;
                this.setState({
                    selected_carr_reg: this.state.graphs[e.target.value],
                    selected_graph_reg: e.target.value,
                });
                document.getElementsByName("head-reg")[0].disabled = "disabled";
            }
    }}
    changeState(e, reg=false){
        if (e.target.value != "head"){
            if(!reg){
                this.state.url[8] = e.target.value;
                this.setState({
                    selected_state: this.state.selected_carr[e.target.value],
                    selected_graph: this.state.selected_graph + "/" + e.target.value,
                });
                document.getElementsByName("head")[1].disabled = "disabled";
                document.getElementById("mean-price-select-form").style.display = "none";
            } else {
                this.state.url_reg[8] = e.target.value;
                this.setState({
                    selected_state_reg: this.state.selected_carr_reg[e.target.value],
                    selected_graph_reg: e.target.value,
                });
                document.getElementsByName("head-reg")[1].disabled = "disabled";
            }
    }}
    changeMot(e){
        if (e.target.value != "head"){
            this.state.url_reg[9] = e.target.value;
            this.setState({
                selected_mot_reg: this.state.graphs[e.target.value],
                selected_graph_reg: e.target.value,
            });
            document.getElementsByName("head-reg")[2].disabled = "disabled";
            document.getElementById("reg-select-form").style.display = "none";
        }
    }
    resetRegFilter(e){
        e.preventDefault();
        this.setState({
            selected_carr_reg: [],
            selected_graph_reg: [],
            selected_state_reg: [],
            selected_mot_reg: [],
            url_reg: this.state.base_url,
        });
        document.getElementsByName("head-reg")[0].disabled = false;
        document.getElementsByName("head-reg")[0].selected = true;
        document.getElementById("reg-select-form").style.display = "block";
    }
    resetMeanPriceFilter(e){
        e.preventDefault();
        this.setState({
            selected_carr: [],
            selected_graph: [],
            selected_state: [],
            url: this.state.base_url,
        });
        document.getElementsByName("head")[0].disabled = false;
        document.getElementsByName("head")[0].selected = true;
        document.getElementById("mean-price-select-form").style.display = "block";
    }
    
    goTo(n){
        
        document.getElementsByClassName("gen-view")[0].onwheel = ()=>{};
        const new_id_view = document.getElementsByClassName(this.ids_list[n])[0];
        new_id_view.scrollIntoView();
       
        
    }
    hoverTab(n){
        
        const paragraph = document.getElementsByClassName("indexing-tab")[n].previousElementSibling;
        paragraph.style.animation = "0.6s fadein ease-in forwards";
        paragraph.style.color = "rgba(117,3,3, 0.8)";
    }
    outTab(n){
        setTimeout(()=>{
            const paragraph = document.getElementsByClassName("indexing-tab")[n].previousElementSibling;
            paragraph.style.animation = "0.6s fadeout ease-in forwards";
            paragraph.style.color = "rgba(117,3,3, 0.6)";
        }, 1200);
    }
    handleKey(e){
        if (e.keyCode == '40'){
            this.goTo(this.state.last_index + 1);
        } else if (e.keyCode == '38'){
            this.goTo(this.state.last_index - 1);
        }
    }
    addToFavHover(){
        if (!this.state.is_fav){
            document.getElementById("fav-btn").src = static_img+"/faved.png";
        }
    }
    addToFavOut(){
        if (!this.state.is_fav){
            document.getElementById("fav-btn").src = static_img+"/tofav.png";
        }
    }
    addToFav(){
        if (!this.state.is_fav){
            fetch('addToFavorites?item='+this.props.item);
            this.setState({is_fav: true});
        } else {
            fetch('removeFromFavorites?item='+this.props.item);
            this.setState({is_fav: false});
        }
    }
    render() {
        var slider_settings = {
            ref: slider => this.slider = slider,
            infinite: false,
            speed: 500,
            slidesToShow:1,
            slidesToScroll:1,
            speed: 900,
            dots: window.innerWidth <= 800 ? true : false,
        };
        return (
            <div>
                <div className="loading">
                Chargement des données, veuillez patienter.
                </div>
                <div className="scroller">
                <ul>
                    <li onMouseOver={(e)=>this.hoverTab(0)} onMouseOut={(e)=>this.outTab(0)} className="scroller-list-component"><p>Index</p><span className="indexing-tab"></span></li>
                    <li onMouseOver={(e)=>this.hoverTab(1)} onMouseOut={(e)=>this.outTab(1)} className="scroller-list-component"><p>Prix moyen</p><span className="indexing-tab"></span></li>
                    <li onMouseOver={(e)=>this.hoverTab(2)} onMouseOut={(e)=>this.outTab(2)} className="scroller-list-component"><p>Régréssion</p><span className="indexing-tab"></span></li>
                    <li onMouseOver={(e)=>this.hoverTab(3)} onMouseOut={(e)=>this.outTab(3)} className="scroller-list-component"><p>Carte</p><span className="indexing-tab"></span></li>
                    <li onMouseOver={(e)=>this.hoverTab(4)} onMouseOut={(e)=>this.outTab(4)} className="scroller-list-component"><p>Variation</p><span className="indexing-tab"></span></li>
                    <li onMouseOver={(e)=>this.hoverTab(5)} onMouseOut={(e)=>this.outTab(5)} className="scroller-list-component"><p>Volume (données)</p><span className="indexing-tab"></span></li>
                    <li onMouseOver={(e)=>this.hoverTab(6)} onMouseOut={(e)=>this.outTab(6)} className="scroller-list-component"><p>Volume (materiel)</p><span className="indexing-tab"></span></li>
                    <li onMouseOver={(e)=>this.hoverTab(7)} onMouseOut={(e)=>this.outTab(7)} className="scroller-list-component"><p>Informations</p><span className="indexing-tab"></span></li>
                    <li onMouseOver={(e)=>this.hoverTab(8)} onMouseOut={(e)=>this.outTab(8)} className="scroller-list-component"><p>Liens</p><span className="indexing-tab"></span></li>
                </ul>
                </div>
                <div className="gen-view">
                <Slider {...slider_settings}>
                    <div className="images-model slide-element">
                        <div>
                            <div className="image-frame">
                                {this.state.images_url ?
                                <img src={this.state.images_url} alt=""/> : "Aucune image disponible"
                                }
                            </div>
                        </div>
                        <div className="title-frame">
                            <h1>{this.state.marque.replace("slashcharacter001", "/")}</h1>
                            <h2>{this.state.model.replace("slashcharacter001", "/")}</h2>
                            <h3>{this.state.generation.replace("slashcharacter001", "/")}</h3>
                            <p onClick={()=>this.props.switchTab("payment", {item:{url:this.state.url_pie.join('/')+'/'+this.props.item.split(" ").join("_"),
                                                                                item:this.props.item,
                                                                                crypted: this.state.crypted }})}>
                                                                                        Acheter le pdf </p>
                            <div className="etoile">
                                <img
                                    src={!this.state.is_fav ? static_img+"/tofav.png" : static_img+"/faved.png"}
                                    id="fav-btn" alt="Ajouter aux favoris"
                                    onMouseOver={!this.state.is_fav ? ()=>this.addToFavHover() : ()=>{}} 
                                    onMouseOut={!this.state.is_fav ? ()=>this.addToFavOut() : ()=>{}}
                                    onClick={()=>this.addToFav()}
                                    />
                            </div>
                        </div>
                    </div>
                    
                        <div className="graph-prix-moyen">
                        
                            
                            
                            <div className="manage-component-frame">
                                <h2>Prix moyen</h2>
                                <form id="mean-price-select-form">
                                    <select onChange={(e)=>this.changeCarr(e)}>
                                        <option value="head" name="head">
                                            Séléctionnez un type de carrosserie
                                        </option>
                                        {Object.keys(this.state.graphs).map((item, step)=>(
                                            <option value={item} key={step}>
                                                {item.split("_").join(" ").replace("slashcharacter001", "/")}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    {Object.keys(this.state.selected_carr).length ?
                                    <select onChange={(e)=>this.changeState(e)}>
                                        <option value="head" name="head">Séléctionnez l'état du véhicule</option>
                                        {Object.keys(this.state.selected_carr).map((item, step)=>(
                                            <option value={item} key={step}>
                                                {item.split("_").join(" ")}
                                            </option>
                                        ))}
                                    </select>
                                    : ""}
                                    
                                </form>
                                {this.state.url.length == 9 ?
                                <div>
                                    <p><a href={this.state.url.join("/")+"/meanPriceCsv.csv"} download={"prix_moyen_"+this.props.item.split(" ").join("_")+".csv"}>Téléchargez</a> ces données au format CSV.</p>
                                    <button onClick={(e)=>this.resetMeanPriceFilter(e)}>Séléctionner un autre graphique</button>
                                    <button onClick={()=>this.props.addComparison({type:'graph', url:this.state.url.join("/")+"/meanPriceByMonth.svg", name:"Graphique de prix moyen pour " + this.props.item})}>Ajouter au comparateur</button>
                                </div>
                                :
                                <p className="fill-form">Remplissez le formulaire ci-dessus pour afficher le graphique du prix moyen.</p>
                                }
                            </div>
                            <div className="genview-frame-content">
                                {this.state.url.length == 9 ? 
                                
                                    <img src={this.state.url.join("/")+"/meanPriceByMonth.svg"} alt=""/>
                                
                                : 
                                    <img src={static_img+"/empty_plot.svg"} alt=""/>
                                    
                                
                                
                                }
                            </div>
                        </div>
                        <div className="graph-reg">
                            <div className="manage-component-frame">
                                <h2>Régréssion</h2>
                                {this.state.is_premium ? 
                                <div>
                                <form id="reg-select-form">
                                    <select onChange={(e)=>this.changeCarr(e, "reg")}>
                                        <option value="head" name="head-reg">
                                            Séléctionnez un type de carrosserie
                                        </option>
                                        {Object.keys(this.state.graphs).map((item, step)=>(
                                            <option value={item} key={step}>
                                                {item.split("_").join(" ").replace("slashcharacter001", "/")}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    {Object.keys(this.state.selected_carr_reg).length ?
                                    <select onChange={(e)=>this.changeState(e, "reg")}>
                                        <option value="head" name="head-reg">Séléctionnez l'état du véhicule</option>
                                        {Object.keys(this.state.selected_carr_reg).map((item, step)=>(
                                            <option value={item} key={step}>
                                                {item.split("_").join(" ")}
                                            </option>
                                        ))}
                                    </select>
                                    : ""}
                                    {Object.keys(this.state.selected_state_reg).length ?
                                    <select onChange={(e)=>this.changeMot(e)}>
                                        <option value="head" name="head-reg">Séléctionnez le moteur</option>
                                        {Object.keys(this.state.selected_state_reg).map((item, step)=>(
                                            <option value={item} key={step}>
                                                {parseInt(item.split("_").join(" "))} chevaux
                                            </option>
                                        ))}
                                    </select>
                                    : ""}
                                </form>    
                                
                                
                                {this.state.url_reg.length == 10 ?
                                    <button onClick={(e)=>this.resetRegFilter(e)}>Séléctionner un autre graphique</button>
                                    :
                                    <p className="fill-form">Remplissez le formulaire ci-dessus pour afficher le graphique de régréssion.</p>
                                } </div> : ""
                                
                                }
                            </div>
                            <div className="genview-frame-content">
                                {this.state.is_premium ?
                                this.state.url_reg.length == 10 ? 
                                    <img src={this.state.url_reg.join("/")+"/"+this.state.crypted+"/regression.svg"} alt=""/>
                                : 
                                    <img src={static_img+"/empty_plot.svg"} alt=""/>
                                : "Accessible uniquement avec un compte premium."}
                            </div>
                        </div>
                    
                    
                        <div className="svg-container active-view">
                            <div className="manage-component-frame">
                            <h2>Statistiques selon le département</h2>
                            
                            
                                <form className="form-select-container">
                                    <span className="form-select">
                                        <select onChange={(e)=>this.changeColor(e)} id="select-map-type" defaultValue="Prix moyen par département">
                                            <option value="Volume d'offre par département" className="onlyPremium">Volume d'offre par département</option>
                                            <option value="Prix moyen par département">Prix moyen par département</option>
                                        </select>
                                        
                                    </span>
                                </form>
                                <span className="genview-card-sep"></span>
                                    <FilterCard itemObject={this.state.graphs} filterzip={(gen, car)=>this.filterZipCodes(gen, car)}/>
                                
                            </div>
                            <div className="genview-frame-content">
                            
                                <SVGMap map={France}/>
                                
                                <ul id="overseas-list">

                                </ul>
                            </div>
                        </div>
                        <div className="percentage-container">
                            <div className="manage-component-frame">
                                <h2>Pourcentage de variation selon les x derniers jours</h2>
                                {this.state.is_premium ?
                                    <ModelPercentage item={this.props.item}/> : ""
                                }
                            </div>
                            <div className="genview-frame-content">
                                <ul id="percentage-list">
                                    <li><h4>3 mois : </h4><br/>{this.state.percentage1 != -1 ? String((this.state.percentage1 * 100 - 100).toFixed(2)) + "%" : "Aucune donnée"}</li>
                                    <li><h4>6 mois : </h4><br/>{this.state.percentage2 != -1 ? String((this.state.percentage2 * 100 - 100).toFixed(2)) + "%" : "Aucune donnée"}</li>
                                    <li><h4>12 mois : </h4><br/>{this.state.percentage3 != -1 ? String((this.state.percentage3 * 100 - 100).toFixed(2)) + "%" : "Aucune donnée"}</li>
                                </ul>
                            </div>
                            
                        </div>
                    
                    
                        <div className="volume-data">
                            <div className="manage-component-frame">
                            <h2>Evolution du volume de données</h2>
                            </div>
                            <div className="genview-frame-content">
                            {this.state.is_premium ?
                                <span>
                                    <img src={this.state.url_pie.join("/")+"/"+this.state.crypted+"/volume_data.svg"}/>
                                    Jauge de quantité sur nos données par rapport au modèle avec le plus d'entrées :
                                    <div className="meter-container">
                                        <p>{(this.state.this_volume / this.state.max_volume * 100).toFixed(2)} %</p>
                                        <span className="meter" style={{width: String(this.state.this_volume / this.state.max_volume * 100) + "%"}}></span>
                                    </div>
                                    
                                </span>
                                : "Accessible uniquement avec un compte premium"
                            }
                            </div>
                        </div>
                        <div className="pie-graphs-container">
                            <div className="manage-component-frame">
                            <h2>Volume matériel</h2>
                            </div>
                            <div className="genview-frame-content">
                                <div className="pie-imgs">
                                    
                                    <span>
                                        <p>Types d'énergie</p>
                                        {this.state.url_pie.length ?
                                        <img src={this.state.url_pie.join("/")+"/energie.svg"} alt="No motor datas" title="Types d'énergie"/> : "Loading"
                                        }
                                    </span>
                                    <span>
                                        <p>Types de transmition</p>
                                        {this.state.url_pie.length ?
                                        <img src={this.state.url_pie.join("/")+"/transmission.svg"} alt="No transmition data" title="Types de transmition"/> : "Loading"
                                        }
                                    </span>
                                </div> 
                            </div>
                            
                        </div>
                    
                    
                    
                    <div className="infos-model slide-element">
                        <InfosModel item={this.props.item} is_premium={this.state.is_premium}/>
                    </div>
                    <div className="buy-frame">
                    </div>
                </Slider> 
                </div>
             
            </div>
        )
    }
}

export default GenView
