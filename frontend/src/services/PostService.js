import axios from "axios";
import { getLoggedInUserID, getToken } from "./utils";

export default class PostService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}`;
    }

    static async addPost(post) {
        let res = null;
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };
        try {
            res = await axios.post(
                `${PostService.baseURL()}/posts/addPost`,
                post,
                { headers }
            );
            return res.status;
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }

    static async allPosts(limit, page) {
        let res = null;

        try {
            res = await axios.get(`${PostService.baseURL()}/posts/`, {
                params: {
                    limit: limit,
                    page: page,
                },
            });
            return res.data;
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }

    static async allPostByUserID(limit, page) {
        let res = null
        const userID = getLoggedInUserID();
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };

        try {
            res = await axios.get(`${PostService.baseURL()}/posts/postedBy/${userID}`, {
                params: {
                    limit: limit,
                    page: page,
                },
                headers: headers
            })
            return res.data
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            };
        }
    }
}
