import React, { Component } from 'react'
import * as AUTH from '../../authentication/methods.js'
export class ProfileMenu extends Component {
    
    logout(){
        AUTH.logout();
        this.props.actualise({username:'Anonymous',
                            password: '',
                            email:'',
                            group: '',});
        this.props.close();
    }
    render() {
        return (
            <div id="profile-list">
                <ul>
                    {this.props.user.group.includes("admin") ? 
                        <li onClick={()=>this.props.switchTab('manage_pannel')}>Manage DB</li> : ""
                    }
                    <li onClick={()=>this.logout()}>Déconnexion</li>
                    <li>Passer Premium</li>
                    <li onClick={()=>this.props.close()}>Fermer</li>
                </ul>
            </div>
        )
    }
}

export default ProfileMenu
