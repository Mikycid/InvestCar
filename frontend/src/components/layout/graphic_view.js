import React, { Component } from 'react'

export class graphic_view extends Component {
    render() {
        return (
            <div className="model-view-graph2">
                <form>
                    <select onChange={(e)=>this.changeState(e.target.value)}>
                    {Object.keys(this.state.graphs).map((item)=>(
                        <option key={item}>
                            {item}
                        </option>
                        
                    ))}
                    </select>
                    <select id="graph-state" onChange={(e)=>this.changeGraph(e.target.value)}>
                        {this.mapOnKey(this.state.selected_state)}
                    </select>
                </form>
                <div className="graph-frame">
                    <img src={this.getUrl(this.state.selected_state, this.state.selected_graph)} />
                </div>
            </div>
        )
    }
}

export default graphic_view
