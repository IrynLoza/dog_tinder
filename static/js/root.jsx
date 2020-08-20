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
                        <Link to="/matches"> Matches </Link>
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

    return (
        <div> 
            <img src="/static/images/cake.jpg"></img>
            <br></br>
            Update photo
            <input type="file" accept="image/*, image/heic, image/heif"></input>
            <div>User name: </div>
            <br></br>
            <label>Choose a breed:</label>
                <select id="breeds" name="breeds" size="2" multiple>
                    <option value="pembroke">Corgi</option>
                    <option value="pug">Pug</option>
                </select>
                <br></br>    
            <input type="radio" id="male" name="gender" value="male"></input>
            <label htmlFor="male">Male</label>

            <input type="radio" id="female" name="gender" value="female"></input>
            <label htmlFor="female">Female</label> 
            <br></br>
            Location:
            <br></br>
            Email:
            <br></br>      
            Summary:
            <textarea></textarea> 
            <br></br>      
            Preferences:
            <textarea></textarea>  
        </div>
    );
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


function User(props) {
    const {match} = props
    const history = useHistory();

    function userDetail() {
        console.log('===> userDetails', match);
        history.push(`/matches/${match.user_id}`);
    }

    return (
        <li onClick={userDetail}>
            <img src={match.user_img}></img>
            <div>Name: {match.user_name}</div>
            <div>Summary: {match.summary}</div>
        </li>
      )
    } 

function UserList(props) {
    const matches = props.matches
  
    return (    
        <ul>
            {matches.map((match, index) => {
                return <User match={match} key={index}/>
            })}
        </ul>
    )

}

function Matches() {

    const [matches, setMatches] = React.useState('')
   
    function getMatchUser() {
        request({method: 'GET', path: '/api/matches'})
        .then((data) => {
            console.log(data)
            setMatches(data)
        })
    }

    React.useEffect(() => {       
       getMatchUser()
      }, [])

    if(matches.length) {
        return (
            <div> 
               <UserList matches={matches}/> 
            </div>
    );                
    } 
    return <div>Loading...</div>
}

function UserDetail(props){

    const userId = props.match.params.id
    const [user, setUser] = React.useState('')

    function getUserDetails() {
        request({method: 'GET', path: `/api/users/${userId}`})
        .then((data) => {
            setUser(data)
        })  
    }

    React.useEffect(() => {       
        getUserDetails()
       }, [])
    
    

    return (
        <div>
        <img src={user.user_img}></img>
        <div>Name: {user.user_name}</div>
        <div>Breed: {user.breed}</div>
        <div>Gender: {user.gender}</div>
        <div>Email: {user.email}</div>
        <div>Location: {user.location}</div>
        <div>Summary: {user.summary}</div>
        </div>
    );
}

function PrivateRoute(){
    const sessionKey = localStorage.getItem('session-key');
    const history = useHistory();
    if(!sessionKey){
        history.push("/");
    }
    return (
        <div>
            <Route exact path="/matches"><Matches /></Route>
            <Route path="/matches/:id" render={routeProps => <UserDetail {...routeProps}/>} />
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