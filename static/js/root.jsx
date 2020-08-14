'use strict';

// document.onload(function(){
//  

// })



const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

function Homepage() {
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


function About() {
    return <div> About </div>
}

function UserProfile() {
    return <div> User Profile </div>
}

function App() {
    React.useEffect(() => {
        const seesionKey = localStorage.getItem('seesion-key');
        if(seesionKey){
            console.log('session', seesionKey)
        } else {
            console.log('NO session')
        }
    }, []);

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <p>
                            <Link to="/"> Home </Link>
                        </p>
                        <p>
                            <Link to="/about"> About </Link>
                        </p>
                        <p>
                            <Link to="/user-profile"> Profile </Link>
                        </p>
                    </ul>
                </nav>
                    <Switch>
                        <Route path="/user-profile">
                            <UserProfile />
                        </Route>
                        <Route path="/about">
                            <About />
                        </Route>
                        <Route path="/">
                            <Homepage />
                        </Route>
                    </Switch>
            </div>
        </Router>
    );
}

ReactDOM.render(<App />, document.getElementById('root'))