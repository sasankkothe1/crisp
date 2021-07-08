import UserService from "../../services/UserService";

export function login(username, password) {
    function onSuccess(user) {
        return { type: "LOGIN_SUCCESS", user: user };
    }
    function onFailure(error) {
        return { type: "LOGIN_FAILURE", error: error };
    }

    return async (dispatch) => {
        try {
            const res = await UserService.login(username, password);

            if (res.user) {
                dispatch(onSuccess(res.user));
            } else dispatch(onFailure(res));
        } catch (error) {
            dispatch(onFailure(error));
        }
    };
}

export function logout() {
    UserService.logout();
    return { type: "LOGOUT" };
}

export function loginReset() {
    return { type: "LOGIN_RESET" };
}

export function register(firstName, lastName, username, email, password) {
    function onSuccess(user) {
        return { type: "LOGIN_SUCCESS", user: user };
    }
    function onFailure(error) {
        return { type: "LOGIN_FAILURE", error: error };
    }

    return async (dispatch) => {
        try {
            const res = await UserService.register(
                firstName,
                lastName,
                username,
                email,
                password
            );

            if (res.user) {
                dispatch(onSuccess(res.user));
            } else {
                dispatch(onFailure(res));
            }
        } catch (error) {
            dispatch(onFailure(error));
        }
    };
}
