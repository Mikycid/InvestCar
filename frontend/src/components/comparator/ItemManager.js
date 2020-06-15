import React, { Component } from 'react'

export class ItemManager extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected_item: -1,
            has_deleted: false,
        }
    }
    quit(){
        document.getElementById("item-manager").style.display = "none";
    }
    printItemDetails(e){
        this.setState({
            selected_item: e.target.value,
        });
    }
    deleteItem(){
        this.setState({selected_item: -1});
        this.props.deleteItem(this.state.selected_item);
        document.getElementById("item-manager-select-item").value = "Séléctionnez un item";
    }
    render() {
        return (
            <div id="item-manager-child">
                <select onChange={(e)=>this.printItemDetails(e)} id="item-manager-select-item">
                    <option>Séléctionnez un item</option>
                    {this.props.items.map((item, step)=>(
                        <option key={step} value={step}>{item.type + " : " + item.name.split(':').join(" / ")}</option>
                    ))}
                </select>
                {this.state.selected_item != -1 ?
                    <div>
                        {this.props.items[this.state.selected_item].name.split(":").join(" ")}<br/>
                        Position : {this.props.items[this.state.selected_item].pos.join("-")}<br/>
                        <span id="modify-item-pos">
                            <span className={this.props.items[this.state.selected_item].pos.join("-") == "0-0" ? "current_item_pos" : ""} onClick={()=>this.props.newItemPosition(this.state.selected_item, "0-0")}></span>
                            <span className={this.props.items[this.state.selected_item].pos.join("-") == "0-1" ? "current_item_pos" : ""} onClick={()=>this.props.newItemPosition(this.state.selected_item, "0-1")}></span>
                            <span className={this.props.items[this.state.selected_item].pos.join("-") == "1-0" ? "current_item_pos" : ""} onClick={()=>this.props.newItemPosition(this.state.selected_item, "1-0")}></span>
                            <span className={this.props.items[this.state.selected_item].pos.join("-") == "1-1" ? "current_item_pos" : ""} onClick={()=>this.props.newItemPosition(this.state.selected_item, "1-1")}></span>
                        </span>
                        <button onClick={()=>this.deleteItem()}>Supprimmer</button>
                    </div> : ""
                }
                <button onClick={()=>this.quit()}>Quitter</button>
            </div>
        )
    }
}

export default ItemManager
