import React, { Component } from 'react';
import List from '../list.js';
import ImageLayout from './imagelayout.js';
import ModelView from '../ModelView.js';
import MarkView from '../markView.js';
import Cookies from 'universal-cookie';
import Slider from 'react-slick';
import Connexion from '../Connexion.js';
import Inscription from '../Inscription.js';
import ManagePannel from '../ManagePannel.js';
import Contact from '../contact.js';
import GenView from '../GenView.js';
import About from '../About.js';
import PaypalFrame from './PaypalFrame.js';
import Thanks from '../thanks.js';
import Comparator from '../comparator/Comparator.js';
import Statistics from '../../staff/Statistics.js';

const cookies = new Cookies();

export class Content extends Component {

    constructor(props){
        super(props);
        this.state = {
            active_page: 1,
            page_list: ["page_view", "test"],
            best_models: [],
            best_percentages: [],
            images_url: [],
            has_loaded: false,
        }
    }
    componentDidMount(){
        
        fetch("/bestPercentages")
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                best_models: results.models,
                best_percentages: results.percentages,
                has_loaded: true,
            });
        });
        fetch("/getMainPageImages")
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                images_url: results.images,
            });
            
        });
    }
    componentDidUpdate(){
        if(this.props.onglet === "index" && !this.state.has_loaded){
            this.setState({
                has_loaded: true,
            });
            fetch("/bestPercentages")
            .then(res=>res.json())
            .then((results)=>{
                this.setState({
                    best_models: results.models,
                    best_percentages: results.percentages,
                });
            });
            fetch("/getMainPageImages")
            .then(res=>res.json())
            .then((results)=>{
                this.setState({
                    images_url: results.images,
                });
                
            });
            try {
                document.getElementsByClassName("header_not_main")[0].className = "header";
            } catch (e) {

            }
    }
    }
    getLastPage(){
        return cookies.get('page');
    }
    render() {
        var slider_settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow:1,
            slidesToScroll:1,
        };
        return (
            <div className="container-page snap-on-root">
                {this.props.onglet === "index" ?
                    <div className="page_content">
                                <Slider {...slider_settings} >
                                    <div className="slide-element">
                                        <ImageLayout switchTab={(i, item)=>this.props.switchTab(i, item)} best_models={this.state.best_models} best_percentages={this.state.best_percentages} images_url={this.state.images_url} index={0}/>
                                        
                                    </div>
                                    <div className="slide-element">
                                        <ImageLayout switchTab={(i, item)=>this.props.switchTab(i, item)} best_models={this.state.best_models} best_percentages={this.state.best_percentages} images_url={this.state.images_url} index={1}/>
                                    </div>
                                    <div className="slide-element">
                                        <ImageLayout switchTab={(i, item)=>this.props.switchTab(i, item)} best_models={this.state.best_models} best_percentages={this.state.best_percentages} images_url={this.state.images_url} index={2}/>
                                        
                                    </div>
                                    <div className="slide-element">
                                        <ImageLayout switchTab={(i, item)=>this.props.switchTab(i, item)} best_models={this.state.best_models} best_percentages={this.state.best_percentages} images_url={this.state.images_url} index={3}/>
                                    </div>
                                    <div className="slide-element">
                                        <ImageLayout switchTab={(i, item)=>this.props.switchTab(i, item)} best_models={this.state.best_models} best_percentages={this.state.best_percentages} images_url={this.state.images_url} index={4}/>
                                    </div>
                                </Slider>
                                
                        

                    </div>
                    : ""
                }
                {this.props.onglet === "main_stats" ?
                    <div className="page_content">
                        <List page={this.getLastPage() ? this.getLastPage() : "1"} switchTab={(i, item)=>this.props.switchTab(i, item)}/>
                    </div>
                    :""
                }
                {this.props.onglet === "modelview" ?
                    <div className="page_content">
                        <ModelView item={this.props.item} switchTab={(i, item)=>this.props.switchTab(i,item)} user={this.props.user}/>
                    </div>
                    : ""
                }
                {this.props.onglet == "genview" ?
                    <div className="page-content">
                        <GenView item={this.props.item} switchTab={(i, item)=>this.props.switchTab(i,item)} user={this.props.user} goBack={()=>this.props.goBack()} addComparison={(item)=>this.props.addComparison(item)}/>
                    </div>
                    : ""
                }
                {this.props.onglet === "markview" ?
                    <div className="page_content">
                        <MarkView item={this.props.item} switchTab={(i, item)=>this.props.switchTab(i, item)}/>
                    </div>
                    : ""

                } 
                {this.props.onglet === "connexion" ?
                    <div className="page-content">
                        <Connexion goBack={()=>this.props.goBack()} switchTab={(tab, item)=>this.props.switchTab(tab, item)} actualise={(u)=>this.props.actualise(u)} user={this.props.user}/>
                    </div>
                    : ""
                }  
                {this.props.onglet === "inscription" ?
                    <div className="page-content">
                        <Inscription switchTab={(tab, item)=>this.props.switchTab(tab, item)} />
                    </div>
                    : ""
                }
                {this.props.onglet === "manage_pannel" ?
                    <div className="page-content">
                        <ManagePannel/>
                    </div>
                    : ""
                }
                {this.props.onglet === "contact" ?
                    <div className="page-content">
                        <Contact user={this.props.user}/>
                    </div>
                    : ""
                }
                {this.props.onglet === "about" ?
                    <div className="page-content">
                        <About/>
                    </div>
                    : ""
                }
                {this.props.onglet === "payment" ?
                    <div className="page-content">
                        <PaypalFrame item={this.props.item} />
                    </div>
                    : ""
                }
                {this.props.onglet === "thanks" ?
                    <div>
                        <Thanks />
                    </div>
                    : ""
                }
                {this.props.onglet === "comparator" ?
                    <div className="page-content">
                        <Comparator items={this.props.compared_items} goBack={()=>this.props.goBack()}/>
                    </div>
                    : ""
                }
                {this.props.onglet === "admin_statistics" ? 
                    <div className="page-content">
                        <Statistics />
                    </div> : ""
                }
            </div>
        )
    }
}

export default Content
