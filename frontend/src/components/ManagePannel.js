import React, { Component } from 'react'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export class ManagePannel extends Component {
    constructor(props){
        super(props);
        this.state = {
            lines: [1],
            errors: [],
        }
    }
    
    onSubmit(e){
        e.preventDefault();
        
        this.state.lines.forEach((i)=>{
            console.log(i);
            let form_datas = document.querySelectorAll("._"+String(i));
            let datas = [];
            form_datas.forEach(x=>{
                if(x.tagName == "TD"){
                    if(x.firstElementChild.tagName == "INPUT") {
                        datas.push(x.firstElementChild.value);
                    }
                }
            });
            fetch("/manageDatabase?datas="+datas)
            .then(res=>res.json())
            .then((results)=>{
                if(results.errors.length){
                    this.setState({errors: errors.push(result.errors[0])});
                }
            });
        });
            
        
    }
    onFileSubmit(e){
        e.preventDefault();
        const file = document.getElementById("file-input").files[0];
        const fd = new FormData();
        fd.append('file-input', file);
        const csrfToken = cookies.get('csrftoken');
        const headers = new Headers({
            'X-CSRFToken': csrfToken,
        });
        
        fetch('/sendFileDatas', {
            method: 'POST',
            headers,
            credentials: "include",
            body: fd,
        })
        .then(res=>res.json())
        .then((results)=>{
            console.log(results);
        });
    }
    addColumn(e){
        e.preventDefault();
        this.state.lines.push(this.state.lines[this.state.lines.length - 1] + 1);
        console.log(this.state.lines);
        const table_cols = document.querySelectorAll("tbody tr");
        const delete_line = document.querySelector("tfoot tr");
        const new_del = document.createElement("button");
        new_del.innerHTML = "Supprimer";
        new_del.onclick = (e)=>this.deleteColumn(e);
        new_del.className = "_"+String(this.state.lines[this.state.lines.length - 1]);
        const new_del_case = document.createElement("td");
        new_del_case.className = "_"+String(this.state.lines[this.state.lines.length - 1]);
        new_del_case.appendChild(new_del);
        delete_line.appendChild(new_del_case);
        for (let i=0;i<table_cols.length; i++){
            const new_case = document.createElement("td");
            new_case.className = "_"+String(this.state.lines[this.state.lines.length - 1]);
            const input = document.createElement("input");
            input.type = "text";
            new_case.appendChild(input);
            table_cols[i].appendChild(new_case);
            
        }
        
    }
    deleteColumn(e){
        e.preventDefault();
        this.state.lines = this.state.lines.splice(this.state.lines.indexOf(parseInt(e.target.className.substring(1))), 1);
        const column = document.querySelectorAll("."+e.target.className);
        for(let i=0;i<column.length;i++){
            column[i].remove();
        }
    }
    render() {
        return (
            <div id="manage-pannel">
                <form onSubmit={(e)=>this.onSubmit(e)}>
                    <table>
                        
                        <tbody>
                            <tr>
                                <th>Marque</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Modèle</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Prix</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Génération</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Carrosserie</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Année de création</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Date de l'annonce</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Type de carburant</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Kilométrage</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Transmition</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Code postal</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Chevaux fiscaux</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Chevaux DIN</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                            <tr>
                                <th>Cylindrée</th>
                                <td className="_1"><input type="text"/></td>
                            </tr>
                                
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <td className="_1"><button onClick={(e)=>this.deleteColumn(e)} className="_1">Supprimer</button></td>
                            </tr>
                            <tr>
                                <th><input type="submit" value="Envoyer"/></th>
                                <th><button onClick={(e)=>this.addColumn(e)}>Ajouter une colonne</button></th>
                            </tr>
                        </tfoot>
                    </table>
                
                </form>
                <form id="form-file" onSubmit={(e)=>this.onFileSubmit(e)} encType="multipart/form-data">
                    Vous pouvez envoyer une base de donnée, cette base de donnée doit être du même format que l'exemple ci-dessous. Types de fichiers acceptés : .xlsx, .xls, .csv .<br/>
                    <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" id="file-input" name="file-input"/>
                    <input type="submit" value="Envoyer"/>
                </form>
                <img src={static_img+"/db-structure-helper.png"} alt=""/>
                <div id="form-rules">
                    Règles à respecter : 
                    <ul>
                        <li>Tous les champs excepté génération et carrosserie doivent absolument être remplis.</li>
                        <li>Les champs prix, kilométrage, année de création, Chevaux fiscaux/DIN ne doivent contenir que des nombres.</li>
                        <li>La date de l'annonce doit être au format jj/mm/aaaa.</li>
                        <li>Le code postal doit avoir 5 chiffres, si vous ne connaissez que les deux premiers, notez 06000 par exemple.</li>
                        <li>La transmition doit être soit manuel soit automatique, tel qu'écrit dans cette règle.</li>
                        <li>Le type de carburant electrique doit être écrit sans accent.</li>
                        <li>La génération et la carrosserie doivent être écrits selon certains critères de notre base de donnée, ils seront spécifiés ulterieurement.<br/>
                            Notez qu'il est préférable de laisser ces deux champs vides, notre algorithme se chargera de classifier le modèle.
                        </li>
                        <li>
                            Il est impératif de ne pas faire de fautes d'orthographes ou ces données seront inutilisables.<br/>
                            Si le contenu d'un des formulaires est d'une structure complexe, consultez le d'abord en faisant une recherche du modèle sur le site,
                            dans le tableau situé en bas de la page, repérez comment sont écrits chacun des paramètres dans notre base de données.
                        </li>
                        <li>
                            Si le modèle n'est pas connu de notre base de données mais que vous voulez quand même l'ajouter, modifiez d'abord la base de données "prototype".
                        </li>
                        <li>Si vous envoyez une base de données de format excel ou csv, vérifiez bien qu'elle est déjà formattée selon les règles ci-dessus, et il faudra dans ce cas inclure les colonnes génération et type de carrosserie.</li>
                    </ul>
                </div>
                {this.state.errors.length ? 
                    <p>Des erreurs sont survenues sur les colonnes suivantes, elles ne seront pas enregistrées : {this.state.errors.toString()} </p> : ""
                }
            </div>
        )
    }
}

export default ManagePannel
