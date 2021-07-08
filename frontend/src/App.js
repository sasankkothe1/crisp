import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Header from "./components/Header/Header";
import UserLoginView from "./views/UserLoginView";
import RegisterView from "./views/RegisterView";
import HomeView from "./views/HomeView";

import "./App.css"

const useStyles = makeStyles((theme) => ({
    content: {
        marginTop: theme.spacing(10),
    },
}));

function App() {
    const classes = useStyles();

    return (
        <BrowserRouter>
            <div className="App">

                <Header />

                <div className={`${classes.content} main-container`}>
                    <Switch>
                        <Route exact path="/">
                            <HomeView />
                        </Route>
                        <Route exact path="/login">
                            <UserLoginView />
                        </Route>
                        <Route exact path="/register">
                            <RegisterView />
                        </Route>
                        <Route
                            render={() => <Redirect to={{ pathname: "/" }} />}
                        />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
