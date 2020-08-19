'use strict';

const Router = ReactRouterDOM.BrowserRouter;
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
                        <Link to="/users"> Users </Link>
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

function Users() {
    
    const [image, setImage] = React.useState('')
    const [name, setName] = React.useState('')
    const [summary, setSummary] = React.useState('')
    const [target_id, setTarget] = React.useState('');

    function getRandomUser() {
        request({method: 'GET', path: '/api/random-user'})
        .then((data) => {
            console.log(data)
            setImage(data.user_img)
            setName(data.user_name)
            setSummary(data.summary)
            setTarget(data.user_id)
        })
    }

    React.useEffect(() => {       
       getRandomUser()
      }, [])

    function like() {
        request({method: 'POST', body: {target_id}, path: '/api/like'})
        .then(data => {
            if(data.status === 'ok'){
            console.log('Likes happend!!!')
            getRandomUser()

            } else {
                console.log(data.message);
            }

        })
    }

    function dislike() {
        request({method: 'POST', body: {target_id}, path: '/api/dislike'})
        .then(data => {
            if(data.status === 'ok'){
            console.log('Dislike happend!!!')
            getRandomUser()

            } else {
                console.log(data.message);
            }

        })
    }


    return (<div> 
            <img src={image}></img>
            <div>Name: {name}</div> 
            <div>Summary: {summary}</div> 
            <button name="dislike" onClick={dislike}> Next </button>
            <button name="like" onClick={like}> Like </button>
            </div>
            );
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
            <Route path="/users"><Users /></Route>
            <Route path="/user-profile"><UserProfile /></Route>
        </div>
    );

}

function request({method, body, path}) {
    return fetch(path, {
        method, 
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('session-key')}`
        },
    })
    .then(response => { 
        if(response.status !== 200) {
            throw new Error(response.status);
        }
       return response.json();
    })
    .catch(error => {
        if(error.message === "401"){
            localStorage.removeItem('session-key');
            window.location.replace('/');
        }
    })
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