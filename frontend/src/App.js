import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import MainLayout from "./layouts/MainLayout";
import UserLoginView from "./views/UserLoginView";
import RegisterView from "./views/RegisterView";
import PostView from "./views/Post/PostView";
import AddRecipeView from "./views/Recipe/AddRecipeView";
import AddEventView from "./views/Event/AddEventView";
import reducers from "./redux/reducers";
import HomeView from "./views/HomeView";
import ProfileView from "./views/Profile/ProfileView";
import ShopView from "./views/ShopView";
import AddRecipeCollectionView from "./views/RecipeCollection/AddRecipeCollection";
import RecipeIDView from "./views/Recipe/RecipeIDView";
import EditPost from "./views/EditViews/EditPost";
import EditEvent from "./views/EditViews/EditEvent";
import EditRecipe from "./views/EditViews/EditRecipe";

// create store for redux
export const store = createStore(reducers, applyMiddleware(thunkMiddleware));

function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <MainLayout>
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
                        <Route exact path="/profile/:id?">
                            <ProfileView />
                        </Route>
                        <Route exact path="/addPost">
                            <PostView />
                        </Route>
                        <Route exact path="/addRecipe">
                            <AddRecipeView />
                        </Route>
                        <Route exact path="/addEvent">
                            <AddEventView />
                        </Route>
                        <Route exact path="/shop">
                            <ShopView />
                        </Route>
                        <Route exact path="/addRecipeCollection">
                            <AddRecipeCollectionView />
                        </Route>
                        <Route exact path="/viewRecipe/:id">
                            <RecipeIDView />
                        </Route>
                        <Route exact path="/editpost/:id">
                            <EditPost />
                        </Route>
                        <Route exact path="/editevent/:id">
                            <EditEvent />
                        </Route>
                        <Route exact path="/editrecipe/:id">
                            <EditRecipe />
                        </Route>
                        <Route
                            render={() => <Redirect to={{ pathname: "/" }} />}
                        />
                    </Switch>
                </MainLayout>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
