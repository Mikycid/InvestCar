import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import Header from "./layout/header.js";
import Content from "./layout/content.js"
import Cookies from 'universal-cookie';
import * as AUTH from '../authentication/methods.js'
const cookies = new Cookies();


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        onglet: cookies.get('lastTab') ? cookies.get('lastTab') : "index",
        item: cookies.get('item') ? cookies.get('item') : "",
        history_page: [cookies.get('lastTab') ? cookies.get('lastTab') : "index"],
        history_item: [cookies.get('item') ? cookies.get('item') : ""],
        user: {
          username: cookies.get('user') ? cookies.get('user').username : "Anonymous",
          email: cookies.get('user') ? cookies.get('user').email : "",
          group: cookies.get('user') ? cookies.get('user').group : "",
          password: cookies.get('user') ? cookies.get('user').password : "",
        },
        compared_items : cookies.get('comparedItems') ? cookies.get('comparedItems') : [],
    };
  }
  componentDidMount(){
    if(!cookies.get('lastTab')){
      fetch("/incrementVisitor")
    }
    fetch('/isUserLoggedIn')
    .then(res=>res.json())
    .then((results)=>{
      if (results.isLoggedIn){
          fetch('/getUser')
          .then(res=>res.json())
          .then((results)=>{
            if (!results.error){
              this.setState({
                user:{username: results.username,
                      email: results.email,
                      group: results.group,
                      password: results.password,}
              });
              cookies.set('user', {
                'username': results.username,
                'password': results.password,
                'email': results.email,
                'group': results.group,
              }, {sameSite:true});
          }});
      } else {
        if (this.state.user.username != "Anonymous"){
          let fernet = require("fernet");
          let secret = new fernet.Secret("GkHf0-y9IMYoiGsTbUfVj1wtBtolEMLuK2awH9WEu5Y=");
          var token = new fernet.Token({
            secret: secret,
            token: this.state.user.password,
            ttl: 0
          });
          AUTH.authenticate(
            this.state.user.username,
            token.decode(this.state.user.password)
          );
    
          const waitForResponse = (iter) => {
            if(AUTH.isLoggedIn()){
                this.actualise(cookies.get('user'));
            } else {
                if(iter <= 10) {
                    setTimeout(()=>waitForResponse(iter+1), 200);
                }
            }
          }
          waitForResponse(0);
        }
      }
    })
    
  }
  switchTab(tab, item={}, backwards=false) {
    cookies.set('lastTab', tab, {'expires': new Date(Date.now() + 600000), sameSite:true});
    if (item != {}){
      cookies.set('item', item.item, {'expires': new Date(Date.now() + 600000), sameSite:true});
    }
    this.setState({
      onglet: tab,
      item: item.item,
      
    });
    if (backwards){
      this.state.history_page.pop();
      this.state.history_item.pop();
    } else if (tab != "connexion") {
      this.setState({
        history_page: [...this.state.history_page, tab],
        history_item: [...this.state.history_item, item != undefined ? item : {}]
      });
    }
    if (window.innerWidth < 800){
      setTimeout(()=>{
        console.log(document.getElementsByClassName("snap-on-root")[1]);
        document.getElementsByClassName("snap-on-root")[1].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      }, 100);
    }
  }
  goBack(){
    if(this.state.history_page.length >= 2){
      this.switchTab(this.state.history_page[this.state.history_page.length - 2], this.state.history_item[this.state.history_item.length - 2], true);
    } else {
      this.switchTab("index", {}, true);
    }
  }
  actualise(user){
    this.setState({user:user});
  }
  addComparison(item){
    cookies.set('comparedItems', [...this.state.compared_items, item], {sameSite:true});
    this.setState({compared_items: [...this.state.compared_items, item]});
  }
  render() {
    return (
      <Fragment>
        <div id="phone-scroller">
          <Header switchTab={(i, item={})=>this.switchTab(i, item)} onglet={this.state.onglet} goBack={()=>this.goBack()} user={this.state.user} actualise={(u)=>this.actualise(u)}/>
          <Content
            onglet={this.state.onglet}
            switchTab={(i, item)=>this.switchTab(i, item)}
            item={this.state.item}
            actualise={(u)=>this.actualise(u)}
            user={this.state.user} 
            goBack={()=>this.goBack()} 
            compared_items={this.state.compared_items}
            addComparison={(item)=>this.addComparison(item)}/>
        </div>
      </Fragment>
      
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);