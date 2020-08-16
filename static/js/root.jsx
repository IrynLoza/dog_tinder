'use strict';

// const { func } = require("prop-types");

// document.onload(function(){
//  

// })

// const Router = ReactRouterDOM.BrowserRouter;
const Router = ReactRouterDOM.HashRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

function Login(props) {
    console.log('props==>', props);
    const [userName, setName] = React.useState('');
    const [password, setPassword] = React.useState('');

    function login(e) {
        e.preventDefault();
    
        console.log('userName', userName)
        console.log('password', password)
        fetch('/api/login', {
            method: 'POST', 
            body: JSON.stringify({userName, password}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'ok'){
                // browser api for store access_token in local storage
                localStorage.setItem('seesion-key', data.access_token);
                // redirect on main page
            } else {
                console.log(data.message);
            }

        })
    }
    return (<div style={ props.isLogged ? { display : "none"}  : { display: "block"}}> 
                <h1> Welcome to Dog Tinder! </h1>
                <p> Bring more fun to you fluffy friend life! </p>
                {/* *** The main image should be here *** */}
                {/* <img src="/static/images/main.png"></img> */}
                <form> 
                <label>Username</label>
                <input type="text" name="username" onChange={e => setName(e.target.value)}></input>

                <label>Password</label>
                <input type="password" name="password" onChange={e => setPassword(e.target.value)}></input>
                <button name="log_in" onClick={login}> Log in </button>
                <button name="sing_in"> Sing in </button>
                </form>
            </div>
    );
    
}

function HeaderNavigation() {
    if (window.location.pathname === '/') return null;
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <div>
                            Logout 
                        </div>
                    </li>
                    <li>
                        <Link to="/user-profile"> Profile </Link>
                    </li>
                    <li>
                        <Link to="/matches"> Matches </Link>
                    </li>
                    <li>
                        <Link to="/chat"> Chat </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

function UserProfile() {
    return <div> User Profile </div>
}

function Matches() {
    return <div> List of mathes </div>
}

function Chat() {
    return <div> Chat </div>
}


function App() {
    const state = {}
    React.useEffect(() => {
        const seesionKey = localStorage.getItem('seesion-key');
        if(seesionKey){
            state.logged = true
        } else {
            state.logged = false
        }
    });

    return (
        <Router>
            <div>
                <HeaderNavigation />
                <Switch>
                    <Route path="/chat">
                        <Chat />
                    </Route>
                    <Route path="/matches">
                        <Matches />
                    </Route>
                    <Route path="/user-profile">
                        <UserProfile />
                    </Route>
                    <Route path="/">
                        <Login />
                    </Route>
                    <Redirect to="/"/>
                </Switch>
            </div>
        </Router>
    );
}

ReactDOM.render(<App />, document.getElementById('root'))


{/* <Route path="users/:id" component={Users} /> */}