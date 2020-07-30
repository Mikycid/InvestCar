import React, { Component } from 'react'
import { SVGMap } from 'react-svg-map';
import France from '@svg-maps/france.departments';
import ModelPercentage from '../layout/modelPercentage.js';
import InfosBulles from '../layout/InfosBulles.js';

export class CompareView extends Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            crypted: "",
            taken_pos: [],
            tooltip: false,
            tooltip_type: "",
            tooltip_event: {},
        }
    }
    componentDidUpdate(){
        this.state.taken_pos = [];
        
        this.props.items.map((item, step)=>{
            if (item.type == "Carte"){
                fetch('/getMapDatas?type='+item.name.split(":")[1]+'&model='+item.name.split(":")[0])
                .then(res=>res.json())
                .then((results)=>{
                    if(item.name.split(":")[1] == "Volume par département") {
                        try{
                            this.colorMapWithZipcodesVolume(item.name.split(" ").join("_"), results.data);
                        } catch(e) { this.setState({}); }
                    } else if (item.name.split(":")[1] == "Prix moyen par département") {
                        try{
                            this.colorMapWithMeanPriceVolume(item.name.split(" ").join("_"), results.data);
                        } catch(e) { this.setState({}); }
                    }
                });
            }
        });
    }
    componentDidMount(){
        this._isMounted = true;
        fetch('/getEncryptedProtected')
        .then(res=>res.json())
        .then((results)=>{
            if(this._isMounted){
                this.setState({
                    crypted: results.crypted,
                });
        }});
        
        this.props.items.map((item, step)=>{
            if (item.type == "Carte"){
                fetch('/getMapDatas?type='+item.name.split(":")[1]+'&model='+item.name.split(":")[0])
                .then(res=>res.json())
                .then((results)=>{
                    if(item.name.split(":")[1] == "Volume par département"){
                        try{
                            this.colorMapWithZipcodesVolume(item.name.split(" ").join("_"), results.data);
                        } catch (e) { this.setState({}); }
                    } else if (item.name.split(":")[1] == "Prix moyen par département"){
                        try {
                            this.colorMapWithMeanPriceVolume(item.name.split(" ").join("_"), results.data);
                        } catch (e) { this.setState({}); }
                    }
                });
            }
        });
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    colorMapWithZipcodesVolume(class_name, data){
        let postal_codes = document.getElementsByClassName(class_name);
        let max_value = 0;
        data.map((item)=>{
            if (data.count(item) > max_value){
                max_value = data.count(item);
            }
        });
        data.map((item)=>{
            let color = data.count(item) / max_value * 255;
            postal_codes[item].style.fill = "rgb(0,"+color+",0)";
        });
        
        
    }
    colorMapWithMeanPriceVolume(class_name, data){
        let postal_codes = document.getElementsByClassName(class_name);
        let max_value = 0;
        let min_value = 0;
        
        data.map((item)=>{
            if (item[1] > max_value){
                max_value = item[1];
            }
            if (item[1] < min_value || min_value == 0){
                min_value = item[1];
            }
        });
        data.map((item)=>{
            let color = (item[1] - min_value) / (max_value - min_value) * 255 ;
            postal_codes[item[0]].style.fill = "rgb(0,"+color+",0)";
        })
    }
    mapOnItems(item, step){
        if((item.type == "Prix moyen" && !this.state.taken_pos.contains(String(item.pos)))
         || (item.type == "Volume (Énergie)" && !this.state.taken_pos.contains(String(item.pos)))
         || (item.type == "Volume (Transmition)") && !this.state.taken_pos.contains(String(item.pos))){
            this.state.taken_pos.push(String(item.pos));
            return <li key={step} className={"compare-item "+"p"+item.pos.join("-")}>
                    <p onMouseOver={(e)=>this.makeTooltipInfo(e, item.type)} onMouseOut={(e)=>this.makeTooltipInfo(e, "")}>{item.name.split(":").join(" / ")}</p>
                        <img src={item.url+"/"+this.props.format(item.type)} alt="Aucune image trouvée" />
                    </li>
        } else if (item.type == "Régréssion" && !this.state.taken_pos.contains(String(item.pos))){
            this.state.taken_pos.push(item.pos);
            return <li key={step} className={"compare-item "+"p"+item.pos.join("-")}>
                        <p onMouseOver={(e)=>this.makeTooltipInfo(e, item.type)} onMouseOut={(e)=>this.makeTooltipInfo(e, "")}>{item.name.split(":").join(" / ")}</p>
                        {this.state.crypted.length ?
                            <img src={item.url+"/"+this.state.crypted+"/"+this.props.format(item.type)} alt="Aucune image trouvée"/> : ""
                        }
                    </li>
        } else if(item.type == "Carte" && !this.state.taken_pos.contains(String(item.pos))){
            this.state.taken_pos.push(String(item.pos));
            return <li key={step} className={"compare-item "+"p"+item.pos.join("-")}>
                <p onMouseOver={(e)=>this.makeTooltipInfo(e, item.name.split(":")[1])} onMouseOut={(e)=>this.makeTooltipInfo(e, "")}>
                    {item.name.split(":").join(" / ")}
                </p>
                 <SVGMap map={France} locationClassName={item.name.split(" ").join("_")}/>
                  </li>
        } else if(item.type == "Variation" && !this.state.taken_pos.contains(String(item.pos))){
            this.state.taken_pos.push(String(item.pos));
            return <li key={step} className={"compare-item "+"p"+item.pos.join("-")}>
                <ModelPercentage item={item.name} from_comp={true}/>
            </li>
        } else if(item.type == "Volume (Données)" && !this.state.taken_pos.contains(String(item.pos))) {
            this.state.taken_pos.push(String(item.pos));
            return <li key={step} className={"compare-item "+"p"+item.pos.join("-")}>
                <p onMouseOver={(e)=>this.makeTooltipInfo(e, "Offre (volume)")} onMouseOut={(e)=>this.makeTooltipInfo(e, "")}>
                    {item.type + " : " + item.name.split(":").join("/")}
                </p>
                <img src={item.url+"/"+this.state.crypted+"/"+this.props.format(item.type)} alt="Aucune image trouvée" />
            </li>
        }
    }
    makeTooltipInfo(e, type){
        clearTimeout(this.tooltipTimeout);
        e.persist();
        if(e.type == "mouseover"){
            this.tooltipTimeout = setTimeout(()=>{
                this.setState({
                    tooltip: true,
                    tooltip_type: type,
                    tooltip_event: e,
                });
            }, 1000);
        } else {
            this.setState({
                tooltip: false,
            });
        }
    }
    render() {
        return (
            <div>
                {this.state.tooltip ? 
                    <InfosBulles event={this.state.tooltip_event} type={this.state.tooltip_type} /> : "" 
                }
                <ul id="compare-view-list-items">
                {this.props.items.map((item, step)=>(
                    this.mapOnItems(item, step)
                ))}
                </ul>
            </div>
        )
    }
}

export default CompareView
