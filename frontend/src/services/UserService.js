import axios from "axios";

export default class UserService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}/auth`;
    }

    static extractUser(token) {
        let base64Url = token.split(".")[1];
        let base64 = base64Url.replace("-", "+").replace("_", "/");
        let userJson = JSON.parse(window.atob(base64));
        return {
            _id: userJson._id,
            username: userJson.username,
            role: userJson.role,
        };
    }

    static async register(firstName, lastName, username, email, password) {
        try {
            const res = await axios.post(`${UserService.baseURL()}/register`, {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: password,
            });

            if ("token" in res.data) {
                window.localStorage["jwtToken"] = res.data.token;
                res.user = this.extractUser(res.data.token);
            }

            return res;
        } catch (error) {
            return error;
        }
    }

    static async login(user, pass) {
        try {
            const res = await axios.post(`${UserService.baseURL()}/login`, {
                username: user,
                password: pass,
            });

            if ("token" in res.data) {
                window.localStorage["jwtToken"] = res.data.token;
                res.user = this.extractUser(res.data.token);
            }

            return res;
        } catch (error) {
            return error;
        }
    }

    static logout() {
        window.localStorage.removeItem("jwtToken");
    }
}
