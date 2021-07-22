import axios from "axios";
import { getToken } from "./utils";

export default class EventService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}`;
    }

    static async addEvent(event) {
        let res = null;
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };
        try {
            res = await axios.post(
                `${EventService.baseURL()}/events/addEvent`,
                event,
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
}
