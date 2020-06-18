import React, { Component } from 'react'

export class SearchFrame extends Component {
    componentDidMount(){
        document.getElementById("search-marque").style.display = "none";
        document.getElementById("search-model").style.display = "none";
        

        window.onscroll = (e) => {
            try{
            if (!document.getElementById('search').contains(event.target) && !document.getElementById('form-query').contains(event.target) && !document.getElementById('search-frame').contains(event.target)){
                document.getElementById("search-frame").style.display = "none";
            }} catch(e) {}
        }
        window.onclick = (e) => {
            try{
            if (!document.getElementById('search').contains(event.target) && !document.getElementById('form-query').contains(event.target) && !document.getElementById('search-frame').contains(event.target)){
                document.getElementById("search-frame").style.display = "none";
                document.getElementsByName("search-input")[0].value = "";
            }} catch(e) {}
               
            
        }
    }
    componentDidUpdate(){
        try {
            document.getElementsByName("modele")[0].checked = false;
        } catch (e){}
        try {
            document.getElementsByName("marque")[0].checked = false;
        } catch (e) {}
    }
    componentWillUnmount(){
        try{
            document.getElementsByName("marque")[0].checked = false;
        } catch(e) {}
        try {
            document.getElementsByName("modele")[0].checked = false;
        } catch(e) {}
        document.body.onclick = ()=>{};
        document.body.onscroll = ()=>{};
    }
    fadeOutSearch(){
        const searchFrame = document.getElementById("search-frame");
        searchFrame.style.animation = "1s fadeout forwards ease-in";
        
    }
    fadeInSearch(){
        const searchFrame = document.getElementById("search-frame");
        searchFrame.style.animation = "1s fadein forwards ease-in";
    }
    querySome(e){
        if (e.target.value == "modele" && e.target.checked == true){
            try {
                document.getElementsByName("marque")[0].checked = false;
            } catch(e){} 
            try {
                document.getElementsByName("generation")[0].checked = false;
            } catch(e){}
            
            document.getElementById("search-model").style.display = "block";
            document.getElementById("search-marque").style.display = "none";
            document.getElementById("search-gen").style.display = "none";
        } else if (e.target.value == "marque" && e.target.checked == true) {
            try {
                document.getElementsByName("modele")[0].checked = false;
            } catch(e){}
            try {
                document.getElementsByName("generation")[0].checked = false;
            } catch(e){}
            document.getElementById("search-marque").style.display = "block";
            document.getElementById("search-model").style.display = "none";
            document.getElementById("search-gen").style.display = "none";
        } else {
            try{
                document.getElementsByName("marque")[0].checked = false;
            } catch(e) {}
            try {
                document.getElementsByName("modele")[0].checked = false;
            } catch(e) {}
            document.getElementById("search-marque").style.display = "none";
            document.getElementById("search-model").style.display = "none";
            document.getElementById("search-gen").style.display = "block";
        }
    }
    switchSameTab(category, item){
        if(this.props.onglet  === "genview" && category === "genview"){
            this.props.switchTab("blank");
            setTimeout(()=>{
                this.props.switchTab("genview", item);
            }, 20);
            
        } else if(this.props.onglet  === "modelview" && category === "modelview"){
            this.props.switchTab("blank");
            setTimeout(()=>{
                this.props.switchTab("modelview", item);
            }, 20);
        } else if(this.props.onglet  === "markview" && category === "markview"){
            this.props.switchTab("blank");
            setTimeout(()=>{
                this.props.switchTab("markview", item);
            }, 20);
        } else {
            this.props.switchTab(category, item);
        }
    }
    render() {
        return (
            <div id="search-frame">
                <ul>
                
                    <li id="form-query">
                        <form>
                        {this.props.marque.length > 0 ?
                        <span>
                            <input type="radio" name="marque" value="marque" onChange={(e)=>this.querySome(e)} className="radio-filter"/>
                            <label htmlFor="marque">&nbsp;Marques&nbsp;</label>
                        </span>   : ""
                        }
                        {this.props.modele.length > 0 ? 
                        <span>
                            <input type="radio" name="modele" value="modele" onChange={(e)=>this.querySome(e)} className="radio-filter"/>
                            <label htmlFor="modele">&nbsp;Modèles&nbsp;</label>
                        </span>    : ""
                        }
                        {window.innerWidth < 800 ? <br/> :  ""}
                        {this.props.generation.length > 0 ?
                            <span>
                                <input type="radio" name="generation" value="generation" checked onChange={(e)=>this.querySome(e)} className="radio-filter"/>
                                <label htmlFor="modele">&nbsp;Génération&nbsp;</label>
                            </span>    : ""
                        }
                        </form>
                    </li>
                    
                    <span id="search-marque">
                        {this.props.marque.map((item)=>
                            <li key={item} className="search-content" onClick={()=>this.switchSameTab("markview", {item})}>
                                {item.replace("slashcharacter001", "/")}
                            </li>
                        )}
                    </span>
                    <span id="search-model">
                        {this.props.modele.map((item, step)=>
                            <li key={step} className="search-content" onClick={()=>this.switchSameTab("modelview", {item})}>
                                {item.replace("slashcharacter001", "/")}
                            </li>
                        )}
                    </span>
                    <span id="search-gen">
                        {this.props.generation.map((item, step)=>
                            <li key={step} className="search-content" onClick={()=>this.switchSameTab("genview", {item})}>
                                {item.replace("slashcharacter001", "/")}
                            </li>
                        )}
                    </span>
                    {this.props.modele.length == 0 && this.props.marque.length == 0 && this.props.generation.length == 0 ?
                        <li className="search-header-middle">
                            Aucun élément ne correspond à votre recherche
                        </li> : ""
                    }
                </ul>
                
            </div>
        )
    }
}

export default SearchFrame
