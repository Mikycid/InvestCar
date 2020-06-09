import React, { Component } from 'react';
import * as AUTH from '../authentication/methods.js';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export class Connexion extends Component {
    constructor(props){
        super(props);
        this.state = {loading:false};
    }
    
    connexion(e){
        e.preventDefault();
        let username = document.getElementsByName("username")[0].value;
        let password = document.getElementsByName("password")[0].value;
        this.setState({loading: true});
        AUTH.authenticate(username, password);
        const waitForResponse = (iter) => {
            if(AUTH.isLoggedIn()){
                this.props.actualise(cookies.get('user'));
                this.props.goBack();
            } else {
                if(iter <= 10) {
                    setTimeout(()=>waitForResponse(iter+1), 200);
                } else {
                    this.setState({loading: false});
                }
            }
        }
        waitForResponse(0);
        
    }
    render() {
        return (
            <div id="connexion-form-container">
                {this.props.user.username == "Anonymous" && !this.state.loading ? 
                <div>
                    <form onSubmit={(e)=>this.connexion(e)} id="connexion-form">
                        <label htmlFor="username">Nom d'utilisateur : </label>
                        <input type="text" name="username"/><br/>
                        <label htmlFor="username">Mot de passe : </label>
                        <input type="password" name="password"/><br/>
                        <input type="submit" value="Se connecter"/>
                    </form>
                    <p>
                        Pas encore de compte ? <a onClick={()=>this.props.switchTab("inscription")} href="#"> Cliquez ici </a> pour vous inscrire.
                    </p>
                </div>
                    : ""
                }
                {this.state.loading ?
                    <p>Connexion en cours...</p>
                    : ""
                }
                {this.props.user.username != "Anonymous" ?
                    <p>Vous êtes déjà connecté.</p>
                    : ""
                }

            </div>
        )
    }
}

export default Connexion
