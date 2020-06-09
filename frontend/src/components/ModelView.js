import React, { Component, PureComponent } from 'react'


export class ModelView extends Component {
    constructor(props){
        super(props);
        this.state = {
            gen_list: [],
            image: ""
        }
    }
    componentDidMount(){
        fetch('/modelview?modele='+this.props.item.split(" ").join('_'))
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
            gen_list: results.gens,
            });
        });
        fetch("/getImage?modele="+this.props.item+"&marque=false")
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                image: results.image,
            });
        });
    }
    render() {
        
        return (
            <div id="model-view">
                <div id="model-title">
                <img src={this.state.image} alt={this.props.item.replace("slashcharacter001", "/")}/>
                
                
                </div><br/>
                <div id="model-view-list-models">
                
                <ul>
                    <li><h3>{this.props.item.replace("slashcharacter001", "/")} : </h3></li>
                    {this.state.gen_list.map((item, step)=>(
                        <li key={step} onClick={()=>this.props.switchTab("genview", {item:this.props.item + " " + item})}>
                            {item.replace("slashcharacter001", "/")}
                        </li>
                    ))}
                </ul>
                </div>
            </div>
        )
    }
}

export default ModelView
