import React, { Component } from 'react'

export class Statistics extends Component {
    constructor(props){
        super(props);
        this.state = {
            ips: [],
            dates: [],
            mean_by_day: 0,
        }
    }
    componentDidMount(){
        fetch("/getStatsData")
        .then(res=>res.json())
        .then((results)=>{
            this.setState({
                ips: results.ips,
                dates: results.dates,
                mean_by_day: results.mean_by_day,
            });
        });
    }
    render() {
        return (
            <div id="admin_statistics">
                <p>
                    Nombre total de connexion : {this.state.ips.length}<br/>
                    Moyenne de connexion par jour : {this.state.mean_by_day}<br/>
                </p>
                <span>Liste des connexions : 
                    <table>
                        <thead>
                            <tr>
                                <td>Ips</td>
                                <td>Dates</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.ips.map((item, step)=>(
                                <tr key={step}>
                                    <td>{item}</td>
                                    <td>{this.state.dates[step]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </span>
            </div>
        )
    }
}

export default Statistics
