import axios from "axios";
import { getToken } from "./utils";

export default class RatingService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}/rating`;
    }

    static async getUserRate(id, type) {
        let token = getToken();
        if (!token) {
            return {
                status: 401,
            };
        }
        let headers = { Authorization: `Bearer ${token}` };

        const params = {
            type: type,
        };

        try {
            const res = await axios.get(
                `${RatingService.baseURL()}/user_rate/${id}`,
                { headers: headers, params: params }
            );

            return res;
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }

    static async rate(id, type, rating) {
        let token = getToken();
        if (!token) {
            return {
                status: 401,
            };
        }
        let headers = { Authorization: `Bearer ${token}` };

        try {
            const res = await axios.post(
                `${RatingService.baseURL()}`,
                {
                    rating: rating * 2,
                    type: type,
                },
                { headers }
            );

            return res;
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
}
