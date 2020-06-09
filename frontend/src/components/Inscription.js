import React, { Component } from 'react'

export class Inscription extends Component {
    
    validation(e){
        e.preventDefault();
        let username = document.getElementsByName("username")[0].value;
        let password = document.getElementsByName("password")[0].value;
        let password_val = document.getElementsByName("password-val")[0].value;
        let email = document.getElementsByName("email")[0].value;
        let email_val = document.getElementsByName("email-val")[0].value;
        if (this.isEmail(email) && email == email_val && password == password_val){
            fetch('/inscription?username='+username+'&password='+password+'&email='+email)
            .then(res=>res.json())
            .then((results)=>{

            })
        }
    }
    isEmail(email){
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email)){
            return true;
        } else {
            return false;
        }
    }
    render() {
        return (
            <div>
                <form  id="inscription-frame" onSubmit={(e)=>this.validation(e)}>
                    <label htmlFor="username">Nom d'utilisateur : </label>
                    <input type="text" name="username"/>
                    <label htmlFor="password">Mot de passe : </label>
                    <input type="password" name="password"/>
                    <label htmlFor="password-val">Confirmation du mot de passe : </label>
                    <input type="password" name="password-val"/>
                    <label htmlFor="email">Votre email : </label>
                    <input type="text" name="email"/>
                    <label htmlFor="email-val">Confirmation de votre email : </label>
                    <input type="text" name="email-val"/>
                    <input type="submit" value="S'inscrire"/>
                </form>
            </div>
        )
    }
}

export default Inscription
