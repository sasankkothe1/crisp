import axios from "axios";
import { getToken, isTokenValid } from "./utils";

export default class UserService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}`;
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

    // Authentication Queries

    static async register(firstName, lastName, username, email, password) {
        try {
            const res = await axios.post(
                `${UserService.baseURL()}/auth/register`,
                {
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    email: email,
                    password: password,
                }
            );

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
            const res = await axios.post(
                `${UserService.baseURL()}/auth/login`,
                {
                    username: user,
                    password: pass,
                }
            );

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

    // Profile Queries

    static async getUserDetails(userID) {
        try {
            const res = await axios.get(
                `${UserService.baseURL()}/users/getUserDetails/${userID}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    static async followUser(userID) {
        if (isTokenValid()) {
            try {
                const headers = { Authorization: `Bearer ${getToken()}` };
                const res = await axios.put(
                    `${this.baseURL()}/users/followUser/${userID}`,
                    {},
                    { headers }
                );

                return res.data.isFollowing;
            } catch (error) {
                return error;
            }
        } else {
            return new Error("Session expired, please login again");
        }
    }

    static async unfollowUser(userID) {
        if (isTokenValid()) {
            try {
                const headers = { Authorization: `Bearer ${getToken()}` };
                const res = await axios.put(
                    `${this.baseURL()}/users/unfollowUser/${userID}`,
                    {},
                    { headers }
                );

                return res.data.isFollowing;
            } catch (error) {
                return error;
            }
        } else {
            return new Error("Session expired, please login again");
        }
    }

    static async isFollowing(userID) {
        if (isTokenValid()) {
            try {
                const headers = { Authorization: `Bearer ${getToken()}` };
                const res = await axios.get(
                    `${this.baseURL()}/users/isFollowing/${userID}`,
                    { headers }
                );

                return res.data.isFollowing;
            } catch (error) {
                return error;
            }
        } else {
            return new Error("Session expired, please login again");
        }
    }
}
