import axios from "axios";
import { getToken } from "./utils";

export default class PostService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}`;
    }

    static async addPost(post) {
        let res = null
        let token = getToken()
        let headers = { Authorization: `Bearer ${token}` }
        try {
            res = await axios.post(
                `${PostService.baseURL()}/posts/addPost`, post, { headers }
            );
            return res.status
        }
        catch (error) {
            return { status: error.response.status, message: error.response.data.message }
        }
    }
}