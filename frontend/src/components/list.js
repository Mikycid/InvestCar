import React, { Component } from 'react'
import Cookies from 'universal-cookie';
import TableCard from './layout/TableCard.js';
import HelpInfo from './layout/helpInfo.js';

const cookies = new Cookies();

export class List extends Component {
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            modeles: [],
            motors: [],
            page_nb: parseInt(this.props.page),
            page: parseInt(this.props.page),
            firsttime: true,
            toogle_info: false,
        };
        
    }
    askPageContent(page){
        
            fetch("/modelList?page="+page)
                .then(res => res.json())
                
                .then(
                    (result) => {
                    this.setState({
                        isLoaded: true,
                        modeles: result.modeles, 
                        motors: result.motors,
                        page_nb: result.page_nb,
                    });
                ;})

        
        document.getElementById("table-index-car").style.display = "block";
        document.getElementById("table-index-car").style.animation = "1s fadein forwards ease-in";
        document.getElementById("loading").style.display = "none";          
                
        
    }
    goToPage(page){
        if(this.state.page != page && page >= 1){
            cookies.set('page', page, {'expires': new Date(Date.now() + 600000), sameSite: true});
            this.askPageContent(page);
            this.setState({page:page});
            document.getElementById("form-page").firstElementChild.value = "";
        }
    }
    handleSubmit(e){
        e.preventDefault();
        let page = parseInt(e.target.firstElementChild.value);
        if(page > this.state.page_nb) page = this.state.page_nb;
        this.goToPage(page);
    }
    componentDidMount(){
        this.askPageContent(this.props.page);
        document.body.style.overflow = "auto";

    }
    componentWillUnmount(){
        document.body.style.overflow = "hidden";
    }
    toogleInfo(){
        this.setState({
            toogle_info: !this.state.toogle_info,
        });
    }
    
    render() {
        return (
            <div id="table-main-page">
                
                <p id="loading">
                    Loading...
                </p>
                
                <div id="table-index-car">
                    {this.state.toogle_info || window.innerWidth < 1200 ? 
                        <HelpInfo /> : ""
                    }
                    
                    
                    
                    
                        
                    <ul className="list-car">
                    
                    {this.state.modeles.map((item, step) =>(
                        
                            <li key={step}  onClick={()=>this.props.switchTab("genview", {item})}>
                                

                                <TableCard item={item} motors={this.state.motors[step]} step={step}/>

                            </li>
                        
                        
                            
                    ))}
                    </ul>
                    {window.innerWidth > 1200 ? 
                        <p onClick={()=>this.toogleInfo()} id="toogle-infos-list">Informations</p> : ""
                    }
                    
                    <ul id="page-frame">
                        <li onClick={()=>this.goToPage(this.state.page - 1)} className="arrow not_active_page">
                        &lsaquo;
                        </li>
                        
                        <li>
                            <form onSubmit={(e)=>this.handleSubmit(e)} id="form-page">
                                <input maxlenght="5" placeholder={this.state.page}/> / {this.state.page_nb}
                            </form>
                        </li>
                        <li onClick={()=>this.goToPage(this.state.page + 1)} className="arrow not_active_page">
                        &rsaquo;
                        </li>
                        
                        
                    </ul>
                    
                </div>
            </div>
        )
    }
}

export default List
