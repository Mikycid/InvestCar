import React, { Component } from 'react';

export class Comparator extends Component {
    constructor(props){
        super(props);
    }
    mapOnItems(item, step){
        let id = "compare_element_"+String(step);
        return <img className="image-comparator" id={id} src={item.url} key={step}/>
    }
    mouseDown(element) {
        e.preventDefault();
        element.onmousemove = (e)=>this.moveElement(e, element);
        element.onmouseup = ()=>{
            element.onmousemove = () =>{};
        }
        console.log(element);
    }
    moveElement(e, element){
        element.style.top = element.offsetTop - e.clientX + 'px';
        console.log(element.style.top);
        element.style.left = element.offsetLeft - e.clientY + 'px';
        console.log(e.clientX);
    }
    render() {
        return (
            <div id="compare-frame">
                <div id="compare-manage-pannel">
                    <ul>

                    </ul>
                </div>
                {this.props.items.map((item, step)=>(
                    this.mapOnItems(item, step)
                ))}
                
            </div>
        )
    }
}

export default Comparator
