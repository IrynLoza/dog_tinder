'use strict';

// const { func } = require("prop-types");

// document.onload(function(){
//  

// })

const Router = ReactRouterDOM.BrowserRouter;
// const Router = ReactRouterDOM.HashRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useLocation = ReactRouterDOM.useLocation;
const useHistory = ReactRouterDOM.useHistory;

function Logout(){
    const history = useHistory();
    
    function logout(){
        localStorage.removeItem('session-key');
        history.push("/");
    }
    return (
        <a className='logout' onClick={logout}>Logout</a>
    )
}

function Login(props) {
    const sessionKey = localStorage.getItem('session-key');
    const history = useHistory();
    if(sessionKey){
        history.push("/user-profile");
    }

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
                localStorage.setItem('session-key', data.access_token);
                history.push("/user-profile");
                console.log('key', localStorage.getItem('session-key'))

            } else {
                console.log(data.message);
                alert('Invalid Email or Password')
            }

        })
    }
    return (<div> 
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
    const location = useLocation();
    if (location.pathname === '/') return null;
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/user-profile"> Profile </Link>
                    </li>
                    <li>
                        <Link to="/matches"> Matches </Link>
                    </li>
                    <li>
                        <Link to="/chat"> Chat </Link>
                    </li>
                    <li>
                        <Logout />
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


function PrivateRoute(){
    const sessionKey = localStorage.getItem('session-key');
    const history = useHistory();
    if(!sessionKey){
        history.push("/");
    }
    return (
        <div>
            <Route path="/chat"><Chat /></Route>
            <Route path="/matches"><Matches /></Route>
            <Route path="/user-profile"><UserProfile /></Route>
        </div>
    );

}

function App() {
    return (
        <Router>
            <div>
                <HeaderNavigation />
                <Switch>
                    {/* exact show the main route */}
                    <Route exact path="/"><Login /></Route> 
                    <PrivateRoute />
                </Switch>
            </div>
        </Router>
    );
}

ReactDOM.render(<App />, document.getElementById('root'))


{/* <Route path="users/:id" component={Users} /> */}
{/* <Redirect to="/"/> */}