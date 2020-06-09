import React, { Component } from 'react'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export class PaypalFrame extends Component {
    constructor (props){
        super(props);
        this.state = {
            has_loaded: false,
            encrypted: 0,
        }
    }
    componentDidMount(){
      let url = this.props.item.url.split("/");
      let last_item = url.pop() + ".pdf";
      document.body.style.overflow = "auto";
      if(this.props.item.url.split('/').length == 8 && !this.state.has_loaded){
          
          this.state.has_loaded = true;
          paypal.Buttons({
              createOrder: function(data, actions) {
                  document.getElementById("waiting-payment").style.display = "block";
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '0.01'
                    }
                  }]
                });
              },
              onApprove: (data, actions) => {
                fetch("getEncryptedPdf")
                .then(res=>res.json())
                .then((results)=>{
                    this.setState({
                      encrypted: results.encrypt,
                    });
                    document.getElementById("waiting-payment").style.display = "none";
                    
                    const pdf = document.getElementById("download-pdf-link");
                    pdf.style.display = "inline";
                    pdf.href = url.join("/") + "/" +last_item;
                    url.push(this.state.encrypted);
                    pdf.innerHTML = last_item;
                    pdf.click();
                    const text_download = document.getElementById("text-download");
                    text_download.style.display = "inline-block";
                    text_download.innerHTML = "Merci pour votre achat<br/> Vous pouvez récupérer le pdf en cliquant sur le lien : ";
                });
                return actions.order.capture().then(function(details) {
                  console.log("data",data);
                  console.log("details",details);
                  const csrfToken = cookies.get('csrftoken');
                  const headers = new Headers({
                      'X-CSRFToken': csrfToken,
                  });
                  fetch("registerCommand", {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({data:details, item:last_item}),
                  })
                  .then(res=>res.json())
                  .then((results)=>{
                    console.log("success");
                  });
                });
              },
              style: {
                  layout:  'vertical',
                  color:   'blue',
                  shape:   'rect',
              }
            }).render('#paypal-button-container');
              
        }
        
    }
    componentWillUnmount(){
      document.body.style.overflow = "hidden";
    }
    render() {
        return (
            <div id="paypal-container">
                <div id="paypal-button-container">

                </div>
                <div id="product-desc">
                    <h3>{this.props.item.item}</h3>
                    Vous achetez ici un fichier PDF contenant toutes les informations dont nous disposons sur ce modèle.<br/>
                    Aucune garantie ni remboursement ne sera effectué, merci de votre compréhension.
                </div>
                <div id="result-product">
                    <p id="text-download"></p>
                    <a id="download-pdf-link" download></a>
                    <p id="waiting-payment">En attente de récéption du paiement.<br/>Veuillez patienter quelques instants, ne quittez pas la page.</p>
                </div>
                
            </div>
        )
    }
}

export default PaypalFrame
