import React, { Component } from 'react'

export class Contact extends Component {
    
    openMailMsg(e){
        e.preventDefault();
        window.open('mailto:sales@investcar.fr');
    }
   
    render() {
        return (
            <div id="contact-container">

                <div id="contact-container-titre">
                
                    <h1>Vous êtes un professionnel et vous souhaitez nous contacter ?</h1> <br/>
                    
                </div>
                
                <div id="contact-container-text">
                    
                    <img src={static_img+"/logo-pro.png"}/>
                    
                    <p>
                    <h3>Service commercial :</h3> 
                    e-mail : <a onClick={(e)=>this.openMailMsg(e)}>sales@investcar.fr</a> <br/>
                    tel : +33 6 20 01 59 60
                    </p> 
                </div>
                
            </div>
           
        )
    }
}

export default Contact
