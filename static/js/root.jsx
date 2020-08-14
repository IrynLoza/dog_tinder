'use strict';

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

function Homepage() {
    return (<div> 
                <h1> Welcome to Dog Tinder! </h1>
                <p> Bring more fun to you fluffy friend life! </p>
                <img src="/static/images/main.png" width="50%"></img>
                Username:
                <input type="text"></input>
                Password:
                <input type="text"></input>
                <button> Log in </button>
                <button> Sing in </button>
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
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/"> Home </Link>
                        </li>
                        <li>
                            <Link to="/about"> About </Link>
                        </li>
                        <li>
                            <Link to="/user-profile"> Profile </Link>
                        </li>
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

ReactDOM.render(<App />, document.getElementById('root'));