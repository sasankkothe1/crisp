import axios from "axios";
import { getToken } from "./utils";

export default class PostService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}/posts`;
    }

    static async addPost(post) {
        let res = null;
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };
        try {
            res = await axios.post(`${PostService.baseURL()}/addPost`, post, {
                headers,
            });
            return { status: res.status, message: "Uploaded Successfully" };
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
            res = await axios.get(`${PostService.baseURL()}`, {
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

    static async allPostsPersonalized(limit, page) {
        let res = null;

        try {
            let token = getToken();
            let headers = { Authorization: `Bearer ${token}` };
            res = await axios.get(`${PostService.baseURL()}/personalized`, {
                headers: headers,
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

    static async postById(id) {
        let res = null;
        try {
            res = await axios.get(`${PostService.baseURL()}/postByID/${id}`);
            return res.data;
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }

    static async allPostByUserID(limit, page, id) {
        let res = null;
        const userID = id;
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };

        try {
            res = await axios.get(
                `${PostService.baseURL()}/postedBy/${userID}`,
                {
                    params: {
                        limit: limit,
                        page: page,
                    },
                    headers: headers,
                }
            );
            return res.data;
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }

    static async updatePost(post, id) {
        let res = null;
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };
        try {
            res = await axios.put(`${PostService.baseURL()}/${id}`, post, {
                headers,
            });
            return { status: res.status, message: "Edited Successfully" };
        } catch (error) {
            console.log(error);
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
}
