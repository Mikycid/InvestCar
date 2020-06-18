import Cookies from "universal-cookie";
const cookies = new Cookies();

export const authenticate = (username, password) =>{
    if (username != "Anonymous" && password != ""){
        let fernet = require("fernet");
        let secret = new fernet.Secret("GkHf0-y9IMYoiGsTbUfVj1wtBtolEMLuK2awH9WEu5Y=");
        var token = new fernet.Token({
            secret: secret,
            time: Date.parse(1),
            iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        });
        fetch('/connexion?username='+username+'&password='+token.encode(password))
        .then(res=>res.json())
        .then((results)=>{
            if(!results.error){
                login(results.username, password, results.email, results.group);
            } else {
                function alertNoRefresh(){
                    alert("Nom d'utilisateur ou mot de passe incorrect");
                    return false
                }
                alertNoRefresh();
            }
        });
    }
}

export const login = (username, password, email, group) =>{
    
    let fernet = require("fernet");
    let secret = new fernet.Secret("GkHf0-y9IMYoiGsTbUfVj1wtBtolEMLuK2awH9WEu5Y=");
    var token = new fernet.Token({
        secret: secret,
        time: Date.parse(1),
        iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      });
    
    cookies.set('user', {
        'username': username,
        'password': token.encode(password),
        'email': email,
        'group': group,
    }, {sameSite:true});
}
export const logout = ()=>{
    fetch('/deconnexion')
    .then(res=>res.json())
    .then((res)=>{
        cookies.remove('user', {sameSite: true});
        return {username:'Anonymous',
            password: '',
            email:'',
            group: '',}
    })
    
}

export const isLoggedIn = () => {
    let user = cookies.get('user');
    if(user && user.username != "Anonymous"){
        return true
    } else {
        return false
    }
}
