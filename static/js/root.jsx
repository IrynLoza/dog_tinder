'use strict';

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useLocation = ReactRouterDOM.useLocation;
const useHistory = ReactRouterDOM.useHistory;
const { Badge, Button, Col, Carousel, Image, Container, Form, FormControl, ListGroup, Navbar, Nav, Row, Table } = ReactBootstrap;




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
        history.push("/users");
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
                history.push("/users");
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
                <Form>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" onChange={e => setName(e.target.value)}></Form.Control>

                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" onChange={e => setPassword(e.target.value)}></Form.Control>
                <br></br>
                <Button className="menu" name="log_in" onClick={login}> Log in </Button>
                <Button className="menu" name="sing_in"> Sing in </Button>
                </Form>
            </div>
    );
    
}


function HeaderNavigation() {
    // const logo = "/static/images/logo.jpg";
    const location = useLocation();
    if (location.pathname === '/') return null;
    return (

        <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="/">Dog<span className="brand">Tinder</span></Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/user-profile">Profile</Nav.Link>
          <Nav.Link href="/users">Users</Nav.Link>
          <Nav.Link href="/matches">Matches</Nav.Link>
        </Nav>
          <Button variant="outline-light"><Logout /></Button>
      </Navbar>
    




           
    );
}


function UserProfile() {

    const [state, setState] = React.useState({})

    function handleChange(evt) {
        console.log('eveveeeeent', evt.target)
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    }

    function getCurrentUser() {
        request({method: 'GET', path: "/api/current-user"})
        .then((data) => {
            console.log(data)
            setState(data)
        }) 
    }

    React.useEffect(() => {
        getCurrentUser()
    }, [])

    function handleClick(){
        request({method: "PUT", body: state, path: "/api/update/profile"})
        .then((data) => {
            console.log('data from handleClick', data)
        })
    }

    return (
        <div onChange={handleChange}> 
            <Image src={state.user_img} thumbnail></Image>
            <br></br>
            <label>Update photo:</label>
            <input type="text" name="user_img" defaultValue={state.user_img}></input>
            <br></br>
            <label>Username:</label>
            <input type="text" name="user_name" defaultValue={state.user_name}></input>
            <br></br>
            <label>Breed:</label>
            <input type="text" name="breed" defaultValue={state.breed}></input>
            <br></br>    
            <input type="radio" id="male" name="gender"></input>
            <label htmlFor="male" defaultChecked>Male</label>

            <input type="radio" id="female" name="gender"></input>
            <label htmlFor="gender">Female</label> 
            <br></br>
            <label htmlFor="gender">Location:</label>
            <input type="text" name="location" defaultValue={state.location}></input>
            <br></br>
            <label>Email:</label>
            <input type="text" name="email" defaultValue={state.email}></input>
            <br></br>      
            <label>Summary:</label>
            <textarea name="summary" defaultValue={state.summary}></textarea> 
            <br></br>      
            <label>Preferences:</label>
            <textarea name="preferences" defaultValue={state.preferences}></textarea>
            <br></br> 
            <button name="save" onClick={handleClick}> Save changes </button>  
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
    const [pages, setPages] = React.useState([])

   
    function getMatchUser(page) {
        request({method: 'GET', path: `/api/matches?page=${page}`})
        .then((data) => {
            console.log(data)
            setMatches(data.matches)

            let arr = []
            for (let i = 0; i < data.pages; i++) {
                arr.push(i+1)
            }
            setPages(arr);
        })
    }

    React.useEffect(() => { 

       getMatchUser(1)
      }, [])

    function changePage(event) {
        const page = event.target.textContent
        getMatchUser(page);
    }  

    if(matches.length) {
        return (
            <div> 
               <UserList matches={matches}/> 
               <div onClick={changePage}>
                    {pages.map((el, index) => {
                        return <div key={index}>{el}</div>
                    })}
                </div> 
                <Button href="/chat"> Chat </Button>
            </div>
    );                
    } 
    return <div>Loading...</div>
}

function UserDetail(props){

    const userId = props.match.params.id
    const [user, setUser] = React.useState({user_img: []})

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
              <Carousel>
            { user.user_img.map((img, index)=> {
                return (
                        <Carousel.Item key={index}>
                            <img className="d-block w-100" src={img} alt={`First ${index}`}></img>
                        </Carousel.Item>
                )
            })} 
            </Carousel>
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
                <Container className="margin-top-20">
                    <Row>
                    <Col xs={12} md={6}>
                    <Switch>
                            {/* exact show the main route */}
                            <Route exact path="/"><Login /></Route>
                            <PrivateRoute />
                        </Switch>
                    </Col>
                 
                    </Row>

                </Container>

            </div>
        </Router>
    );
}

ReactDOM.render(<App />, document.getElementById('root'))


