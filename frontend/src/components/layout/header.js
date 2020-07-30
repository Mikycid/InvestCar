import React, { Component } from 'react';
import SearchFrame from "./SearchFrame";
import ProfileMenu from "./ProfileMenu";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFrame: false,
            profileMenu: false,
            results_marques: [],
            results_modeles: [],
            results_gen: [],
            user: this.props.user,
            timeout: 0,
        }
    }
    query(e){
        e.preventDefault();
        if(e.target.value != ""){
        fetch("/query?modele="+e.target.value.replace(/[\s]{2,}/g," ")+"&marque="+e.target.value)
        .then(res=>res.json())
        .then((results) => {
            this.setState({ 
                searchFrame:true,
                results_marques: results.marques,
                results_modeles: results.modeles,
                results_gen: results.generations,
            });
            document.getElementById("search-frame").style.display = "block";
            

            




        })} else {
            this.setState({
                results_marques: [],
                results_modeles: [],
                results_gen: [],
                searchFrame: false,
            });
        }
    }
    toogleProfile(){
        
        document.getElementById("profile-list").style.animationPlayState = "paused"
        if(!this.state.profileMenu){
            clearTimeout(this.state.timeout);
            document.getElementById("profile-list").style.animation = "0.5s deploy ease-out forwards";
            document.getElementById("profile-list").style.display = "block";
            
           
            document.body.onscroll =  (e) => {
                if (!e.target.matches("#profile-list, #profile-list ul, #profile-list ul li")){
                    this.toogleProfile();
                }
            }
            document.body.onclick = (e) => {
                if (!e.target.matches("#profile-list, #profile-list ul, #profile-list ul li")){
                    this.toogleProfile();
                }
            }
        } else {
            document.getElementById("profile-list").style.animation = "0.5s outploy ease-out forwards";
            document.body.onclick = function(){};
            document.body.onscroll = function(){};
            this.setState({timeout: setTimeout(()=>document.getElementById("profile-list").style.display = "none", 500)});

        }
        this.setState({
            profileMenu: !this.state.profileMenu,
        });
        
    }
    render() {
        return (
            <nav id="header-container">
                <ul className="header snap-on-root">
                    
                    <li onClick={()=> this.props.switchTab("index")} className={this.props.onglet === "index" ? "active" : "not_active"}><img src={static_img+"/invest-car-logo-60.png"}/></li>
                    <span id="back-button" onClick={()=>this.props.goBack()}>&#x2190;</span>
                    <li onClick={()=> this.props.switchTab("main_stats")} className={this.props.onglet === "main_stats" ? "active" : "not_active"}>Statistiques</li>
                    {this.props.user.username == 'Anonymous' ?
                        <li onClick={()=> this.props.switchTab("connexion")}>Connexion</li>
                        : 
                        <li onClick={()=>this.toogleProfile()}>{this.props.user.username} &nbsp;∨</li>
                    }
                    <li onClick={()=>this.props.switchTab("about")}>A propos</li>
                    <li onClick={()=>this.props.switchTab("contact")}>Contact</li>
                    <li className="not_active">
                        <form id="search">
                            <input type="text" name="search-input" onChange={(e)=>this.query(e)} autoComplete="true"/>
                            <input type="submit" className="loupe" value=""></input>
                        </form>
                    </li>
                    
                </ul>
                { this.state.searchFrame ? <SearchFrame onglet={this.props.onglet} marque={this.state.results_marques} modele={this.state.results_modeles} generation={this.state.results_gen} switchTab={(i, item)=>this.props.switchTab(i, item)}/> : ""}
                <ProfileMenu user={this.props.user} actualise={(u)=>this.props.actualise(u)} close={()=>this.toogleProfile()} switchTab={(tab, item)=>this.props.switchTab(tab, item)}/>
                {window.innerWidth > 1100 && (this.props.user.group.includes('Premium') || this.props.user.group.includes('admin')) ?
                    <img src={static_img+"/compare.png"} alt="Comparer" onClick={()=>this.props.switchTab("comparator")} id="compare-button-hd"/> : ""
                }
            </nav>
        )
    }
}

export default Header
