import React, { Component } from 'react'

export class MarkView extends Component {
    constructor(props){
        super(props);
        this.state = {
            modeles: [],
            image: 0,
            name: this.props.item,
        }
    }
    componentDidMount(){
        fetch("/query?modele=*&marque="+this.props.item)
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                'modeles': results.modeles,
            })
        });
        fetch("/getImage?modele="+this.props.item+"&marque=true")
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                image: results.image,
            });
        });
    }
    componentDidUpdate(){
        if(this.props.item != this.state.name){
            this.setState({
                name: this.props.item,
            });
            fetch("/query?modele=*&marque="+this.props.item)
            .then(res=>res.json())
            .then((results)=>{
                this.setState({
                    'modeles': results.modeles,
                })
            });
            fetch("/getImage?modele="+this.props.item+"&marque=true")
            .then(res=>res.json())
            .then((results)=>{
                this.setState({
                    image: results.image,
                });
            });
    }}
    render() {
        return (
            <div id="mark-view">
                <div id="mark-title">
                <img src={this.state.image} alt={this.props.item.replace("slashcharacter001", "/")}/>
                
                </div>
                <div id="mark-view-list-models">
                <ul>
                    {
                        this.state.modeles.map((item)=>(
                            <li key={item} onClick={()=>this.props.switchTab("modelview", {item: this.props.item + " " + item})}>
                                {item}
                            </li>
                        ))
                    }
                </ul>
                </div>
            </div>
        )
    }
}

export default MarkView
