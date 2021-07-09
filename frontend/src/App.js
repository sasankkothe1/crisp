import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import Header from "./components/Header/Header";
import UserLoginView from "./views/UserLoginView";
import RegisterView from "./views/RegisterView";
import PostView from "./views/Post/PostView";
import reducers from "./redux/reducers";
import HomeView from "./views/HomeView";

import "./App.css";

const useStyles = makeStyles((theme) => ({
    app: {},
    content: {
        marginTop: theme.spacing(10),
        display: "flex",
        justifyContent: "center",
    },
    contentContainer: {},
}));

function App() {
    const classes = useStyles();

    // create store for redux
    const store = createStore(reducers, applyMiddleware(thunkMiddleware));

    return (
        <BrowserRouter>
            <Provider store={store}>
                <div className={classes.app}>
                    <header>
                        <Header />
                    </header>
                    <main className={classes.content}>
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
                            <Route exact path="/addPost">
                                <PostView />
                            </Route>
                            <Route
                                render={() => (
                                    <Redirect to={{ pathname: "/" }} />
                                )}
                            />
                        </Switch>
                    </main>
                </div>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
