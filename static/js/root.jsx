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
                {/* *** The main image should be here *** */}
                {/* <img src="/static/images/main.png"></img> */}
                <form>
                <label>Username</label>
                <input type="text" name="username"></input>

                <label>Password</label>
                <input type="text" name="password"></input>
                <button name="log_in"> Log in </button>
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