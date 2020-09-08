'use strict';

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useLocation = ReactRouterDOM.useLocation;
const useHistory = ReactRouterDOM.useHistory;
const { Badge, Button, ToggleButtonGroup, ToggleButton, Pagination, Col, Carousel, Image, Container, Form, FormControl, ListGroup, Navbar, Card, Nav, Row, Table } = ReactBootstrap;


//********LOG IN / LOG OUT*****/

//Create component to handle Logout in client side
function Logout() {
    const history = useHistory();

    function logout() {
        localStorage.removeItem('session-key');
        history.push("/");
    }
    return (
        <a className='logout' onClick={logout}>Logout</a>
    )
}

//Create component to handle Login in client side
function Login(props) {
    const sessionKey = localStorage.getItem('session-key');
    const history = useHistory();
    if (sessionKey) {
        history.push("/users");
    }

    const [userName, setName] = React.useState('');
    const [password, setPassword] = React.useState('');

    function login(e) {
        e.preventDefault();
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ userName, password }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    // browser api for store access_token in local storage
                    localStorage.setItem('session-key', data.access_token);
                    localStorage.setItem('user', userName);
                    history.push("/users");
                    console.log('key', localStorage.getItem('session-key'));
                } else {
                    console.log(data.message);
                    alert('Invalid Email or Password')
                }

            })
    }
    return (<div>
        <h1> <img src="/static/images/logo.jpg" width="60" height="60"></img>ogTinder</h1>
        <Form>
            <Form.Label className="login-lable">Username</Form.Label>
            <Form.Control type="text" name="username" onChange={e => setName(e.target.value)}></Form.Control>

            <Form.Label className="login-lable">Password</Form.Label>
            <Form.Control type="password" name="password" onChange={e => setPassword(e.target.value)}></Form.Control>
            <br></br>
            <Button className="margin-right button-color" variant="info" name="log_in" onClick={login}> Log in </Button>
            <Button variant="info" className="button-color" name="sing_in"> Sign in </Button>
        </Form>
    </div>
    );

}


//*********NAV BAR******/

function HeaderNavigation() {
    const location = useLocation();
    if (location.pathname === '/') return null;
    return (

        <Navbar className="navbar-color" variant="dark">
            <Navbar.Brand href="/"><img src="/static/images/logo-3.jpg" width="45" height="45"></img>og<span className="brand">Tinder</span></Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/users">Users</Nav.Link>
                <Nav.Link href="/matches">Matches</Nav.Link>
            </Nav>
            <Nav.Link className="profile-menu" href="/user-profile">Profile</Nav.Link>
            <Button variant="outline-light"><Logout /></Button>
        </Navbar>
    );
}

//******CURRENT USER*******/

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
        request({ method: 'GET', path: "/api/current-user" })
            .then((data) => {
                console.log(data)
                setState(data)
            })
    }

    React.useEffect(() => {
        getCurrentUser()
    }, [])

    function handleClick() {
        request({ method: "PUT", body: state, path: "/api/update/profile" })
            .then((data) => {
                console.log('data from handleClick', data)
            })
    }

    return (
        <div onChange={handleChange}>
            <div>
                <Image className="img-item" src={state.user_img} thumbnail></Image>
            </div>
            <Form>
                <label>Update photo</label>
                <Form.Control type="text" name="user_img" defaultValue={state.user_img} />
                <Row>
                    <Col>
                        <br></br>
                        <label>Username</label>
                        <Form.Control placeholder="Username" type="text" name="user_name" defaultValue={state.user_name} />
                    </Col>
                    <Col>
                        <br></br>
                        <label>Breed</label>
                        <Form.Control type="text" name="breed" defaultValue={state.breed} />
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col>
                        <label htmlFor="gender">Location</label>
                        <Form.Control type="text" name="location" defaultValue={state.location} />
                    </Col>
                    <Col>
                        <label>Email</label>
                        <Form.Control type="text" name="email" defaultValue={state.email} />
                    </Col>
                </Row>
                <br></br>
                <label>Gender</label>
                <br></br>
                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                    <ToggleButton variant="info" value={1}>male</ToggleButton>
                    <ToggleButton variant="info" value={2}>female</ToggleButton>
                </ToggleButtonGroup>
                <br></br>
                <br></br>
                <label>Summary</label>
                <Form.Control as="textarea" rows="2" name="summary" defaultValue={state.summary} />
                <br></br>
                <label>Preferences</label>
                <Form.Control as="textarea" rows="2" name="preferences" defaultValue={state.preferences} />
                <br></br>
                <Button variant="info" name="save" onClick={handleClick}>Save changes</Button>
            </Form>
        </div>
    );
}


//*******FIND MATCH******/

function Users() {

    const [image, setImage] = React.useState('')
    const [name, setName] = React.useState('')
    const [summary, setSummary] = React.useState('')
    const [target_id, setTarget] = React.useState('');

    function getRandomUser() {
        request({ method: 'GET', path: '/api/random-user' })
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
        request({ method: 'POST', body: { target_id }, path: '/api/like' })
            .then(data => {
                if (data.status === 'ok') {
                    console.log('Likes happend!!!')
                    getRandomUser()

                } else {
                    console.log(data.message);
                }

            })
    }

    function dislike() {
        request({ method: 'POST', body: { target_id }, path: '/api/dislike' })
            .then(data => {
                if (data.status === 'ok') {
                    console.log('Dislike happend!!!')
                    getRandomUser()

                } else {
                    console.log(data.message);
                }

            })
    }

    return (
        <Row>
            <Col>
                <Image className="item" src={image} thumbnail></Image>
            </Col>
            <Col>
                <div className="text">
                <div> <i className="fas fa-user"></i> {name}</div>
                <div> {summary}</div>
                </div>
                <Button className="margin-right" variant="outline-warning" name="dislike" onClick={dislike}> <i className="far fa-meh"></i> </Button>
                <Button variant="outline-success" name="like" onClick={like}> <i className="far fa-heart"></i> </Button>
            </Col>
        </Row>
    );
}


function User(props) {
    const { match } = props
    const history = useHistory();

    function userDetail() {
        console.log('===> userDetails', match);
        history.push(`/matches/${match.user_id}`);
    }

    return (
        <li onClick={userDetail}>
            <Image className="img-item" src={match.user_img} thumbnail></Image>
            <div className="text">
            <div> <i className="fas fa-user"></i> {match.user_name}</div>
            <div> {match.summary}</div>
            </div>
            <Button variant="info">Details</Button>
            <br></br>
            <br></br>
        </li>
    )
}

function UserList(props) {
    const matches = props.matches

    return (
        <ul>
            {matches.map((match, index) => {
                return <User match={match} key={index} />
            })}
        </ul>
    )

}

function Matches() {

    const [matches, setMatches] = React.useState('')
    const [pages, setPages] = React.useState([])


    function getMatchUser(page) {
        request({ method: 'GET', path: `/api/matches?page=${page}` })
            .then((data) => {
                console.log(data)
                setMatches(data.matches)

                let arr = []
                for (let i = 0; i < data.pages; i++) {
                    arr.push(i + 1)
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

    if (matches.length) {
        return (
            <div>
                <UserList matches={matches} />
                <div onClick={changePage}>
                    <Pagination className="pagination">
                        {pages.map((el, index) => {
                            return (
                                <Pagination.Item id="pagination-color" key={index}>{el}</Pagination.Item>
                            )
                        })}
                    </Pagination>
                </div>
            </div>
        );
    }
    return <div>Loading...</div>
}


function UserDetail(props) {
    const [user, setUser] = React.useState({ user_img: [] })

    const userId = props.match.params.id;
    const currentUser = localStorage.getItem('user');
    const targetUser = user.user_name;
    const roomId = [currentUser, targetUser].sort().reduce((a, b) => a + b, "");
    function getUserDetails() {
        request({ method: 'GET', path: `/api/users/${userId}` })
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
                {user.user_img.map((img, index) => {
                    return (
                        <Carousel.Item key={index}>
                            <img className="img-carusel" src={img} alt={`First ${index}`}></img>
                        </Carousel.Item>
                    )
                })}
            </Carousel>
            <br></br>
            <div className="text">
            <div> <i className="fas fa-user"></i> {user.user_name}</div>
            <div> <i className="fas fa-paw"></i> {user.breed}</div>
            <div> <i className="fas fa-venus-mars"></i> {user.gender}</div>
            <div> <i className="fas fa-envelope"></i> {user.email}</div>
            <div> <i className="fas fa-map-pin"></i> {user.location}</div>
            <div> {user.summary}</div>
            </div>
            <br></br>
            <Button variant="info" href={`/chat/${roomId}`}> Start chat </Button>
        </div>
    );
}


//*******HANDLE FETCH******/

function request({ method, body, path }) {
    return fetch(path, {
        method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('session-key')}`
        },
    })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .catch(error => {
            if (error.message === "401") {
                localStorage.removeItem('session-key');
                window.location.replace('/');
            }
        })
}

//********CHAT******/

function Chat(props) {
    let socket = props.socket;

    const chatId = props.match.params.id;
    const targetUser = chatId.replace(localStorage.getItem('user'), "")

    const [message, setMessage] = React.useState("");
    React.useEffect(() => {
        socket.emit('join', {
            room: chatId,
            user: localStorage.getItem('user')
        })
        socket.on("message", msg => {
            console.log('message===>', msg)
            let element = document.querySelector("#mess");
            let child = document.createElement('DIV');

            if (msg.message === 'join') {
                child.className += 'join';
                child.innerHTML = `<div><p>${msg.username} has entered the room</p></div>`;
                $(".chat").stop().animate({ scrollTop: $(".chat")[0].scrollHeight }, 1000);
            } else if (localStorage.getItem('user') === msg.username) {
                console.log('localstr==>', localStorage.getItem('user'))
                child.className += 'current-user-message';
                child.innerHTML = `<div>${msg.message}</div>`;
                $(".chat").stop().animate({ scrollTop: $(".chat")[0].scrollHeight }, 1000);
            } else {
                child.className += 'user-message';
                child.innerHTML = `<div>${msg.message}</div>`;
                $(".chat").stop().animate({ scrollTop: $(".chat")[0].scrollHeight }, 1000);
            }

            element.appendChild(child);
        });
    }, [])

    const data = {
        message,
        room: chatId,
        user: localStorage.getItem('user')
    }

    const onClick = () => {
        console.log('Clicked==>')
        if (data.message !== "") {
            socket.emit("chat", data);
            setMessage("");
        } else {
            alert('Please, add message.')
        }
    };

    return (
        <div>
            <h3>Start chat with {targetUser}</h3>
            <div className="chat" id='mess'></div>
            <Form.Control type="text"
                onChange={event => setMessage(event.target.value)}
                value={message} />
            <br></br>
            <Button variant="info" type="button" onClick={onClick} value="Send">Send message</Button>
        </div>
    );
};


//*******ROUTES**********/
function PrivateRoute() {
    const socket = io()
    const sessionKey = localStorage.getItem('session-key');
    const history = useHistory();
    if (!sessionKey) {
        history.push("/");
        return;
    }

    return (
        <div>
            <Route exact path="/matches"><Matches /></Route>
            <Route path="/matches/:id" render={routeProps => <UserDetail {...routeProps} />} />
            <Route path="/users"><Users /></Route>
            <Route path="/user-profile"><UserProfile /></Route>
            <Route path="/chat/:id" render={routeProps => <Chat socket={socket} {...routeProps} />} />
        </div>
    );

}

function App() {
    return (
        <Router>
            <div>
                <HeaderNavigation />
                <Container className="margin-top-20">
                    <Row>
                        <Col md={{ span: 6, offset: 3 }}>
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


