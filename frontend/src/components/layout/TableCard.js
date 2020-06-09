import React, { Component } from 'react'

export class TableCard extends Component {
    componentDidMount(){
        const pourcentages = document.getElementsByClassName("pourcentage_"+this.props.step);
        for(let i =0;i<pourcentages.length;i++){
            pourcentages[i].style.fontSize = "20px";
            if(parseFloat(pourcentages.innerHTML) > 1){
                pourcentages[i].style.color = "green";

            } else {
                pourcentages[i].style.color = "#750303";
            }
        }
    }
    componentDidUpdate(){
        const pourcentages = document.getElementsByClassName("pourcentage_"+this.props.step);
        for(let i =0;i<pourcentages.length;i++){
            pourcentages[i].style.fontSize = "20px";
            if(parseFloat(pourcentages.innerHTML) > 1){
                pourcentages[i].style.color = "green";

            } else {
                pourcentages[i].style.color = "#750303";
            }
        }
    }
    render() {
        return (
            

            <ul className="card-container">
                
                    <li>
                        {this.props.item.replace("slashcharacter001", "/")}
                    </li>
                    
                    <li>
                        
                        <div className="float">
                        {this.props.motors.map((item, step)=>(
                                <p key={step}><strong>{item[0]} CV</strong></p>
                        ))}
                        </div>
                        <div className="float">
                        {this.props.motors.map((item, step)=>(
                                <p key={step}>{parseInt(item[1])} €</p>
                        ))}
                        </div>
                        <div className="float">
                        {this.props.motors.map((item, step)=>(
                                <p key={step}><span className={"pourcentage_"+this.props.step}>{item[2]} %</span> </p>
                        ))}
                        </div>
                        
                            
                            
                        
                    </li>
                    
                
            </ul>
            
            
        )
    }
}

export default TableCard
