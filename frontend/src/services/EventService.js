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
            return { status: res.status, message: "Uploaded Successfully" };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }

    static async allEvents(limit, page) {
        let res = null;

        try {
            res = await axios.get(`${EventService.baseURL()}/events/`, {
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

    static async eventById(id) {
        let res = null;
        try {
            res = await axios.get(
                `${EventService.baseURL()}/events/eventByID/${id}`
            );
            return res.data;
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }

    static async allEventsByUserID(limit, page, id) {
        let res = null;
        const userID = id;
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };

        try {
            res = await axios.get(
                `${EventService.baseURL()}/events/postedBy/${userID}`,
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

    static async sideBarEvents() {
        let res = null;

        try {
            res = await axios.get(
                `${EventService.baseURL()}/events/sideBarEvents`
            );
            return res.data;
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }

    static async updateEvent(event, id) {
        let res = null;
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };
        try {
            res = await axios.put(`${EventService.baseURL()}/events/${id}`, event, {
                headers,
            });
            return { status: res.status, message: "Edited Successfully" };
        } catch (error) {

            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
}
