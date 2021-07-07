import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Header from "./components/Header/Header";
import UserLoginView from "./views/UserLoginView";
import RegisterView from "./views/RegisterView";
import PostView from "./views/PostView";

const useStyles = makeStyles((theme) => ({
    content: {
        marginTop: theme.spacing(10),
        display: 'flex',
        justifyContent: 'center'
    },
    contentContainer: {

    }
}));

function App() {
    const classes = useStyles();

    return (
        <BrowserRouter>
            <div className="App">
                <header>
                    <Header />
                </header>
                <main className={classes.content}>
                    <div className={classes.contentContainer}>
                        <Switch>
                            <Route exact path="/">
                                <div>Home</div>
                            </Route>
                            <Route exact path="/login">
                                <UserLoginView />
                            </Route>
                            <Route exact path="/register">
                                <RegisterView />
                            </Route>
                            <Route exact path="/addPost">
                                <PostView />
                            </Route>
                            <Route
                                render={() => <Redirect to={{ pathname: "/" }} />}
                            />
                        </Switch>
                    </div>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
