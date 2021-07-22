import { store } from "../App";
import { logout } from "../redux/actions";

export function isLoggedIn() {
    return Boolean(window.localStorage["jwtToken"]);
}

export function getLoggedInUserID() {
    return store.getState().user._id;
}

export function getToken() {
    return window.localStorage["jwtToken"];
}

export function isTokenValid() {
    if (getToken()) {
        let token = window.localStorage["jwtToken"];
        let base64Url = token.split(".")[1];
        let base64 = base64Url.replace("-", "+").replace("_", "/");
        let userJson = JSON.parse(window.atob(base64));
        // if token is expired delete it and return {}
        // --> User is not logged in anymore.
        if (userJson.exp > Date.now()) {
            handleError({ type: "token_expired" });
            return false;
        }

        return true;
    } else {
        return false;
    }
}

export function handleError(err) {
    if (err.type === "token_expired") {
        store.dispatch(logout());
    }

    return err;
}
