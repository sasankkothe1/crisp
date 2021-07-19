import { store } from "../App";
import { logout } from "../redux/actions";

export function isLoggedIn() {
    return Boolean(window.localStorage["jwtToken"]);
}

export function handleError(res) {
    if (res.status === 401) {
        store.dispatch(logout());
    }
}
