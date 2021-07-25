import axios from "axios";
import { getToken, getBackendURL } from "./utils";

export default class AdminService {
    static async createPartnerManager(name, email) {
        try {
            let headers = { Authorization: `Bearer ${getToken()}` };
            const res = await axios.post(
                `${getBackendURL()}/partner_managers/create`,
                {
                    name: name,
                    email: email,
                },
                { headers: headers }
            );

            console.log(res);

            return res.data;
        } catch (error) {
            return error;
        }
    }

    static async getManagers() {
        try {
            let headers = { Authorization: `Bearer ${getToken()}` };
            const res = await axios.get(
                `${getBackendURL()}/partner_managers/getAll`,
                { headers: headers }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    static async getPartnerRequests() {
        try {
            let headers = { Authorization: `Bearer ${getToken()}` };
            const res = await axios.get(
                `${getBackendURL()}/partner_applications/getAll`,
                { headers: headers }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    static async approveApplication(application, partnerManagerID) {
        try {
            let headers = { Authorization: `Bearer ${getToken()}` };
            const res = await axios.put(
                `${getBackendURL()}/partner_applications/approve`,
                {
                    application: application,
                    partnerManagerID: partnerManagerID,
                },
                { headers: headers }
            );

            console.log(res);

            return res.data;
        } catch (error) {
            return error;
        }
    }

    static async rejectApplication(application) {
        console.log(application);
        try {
            let headers = { Authorization: `Bearer ${getToken()}` };
            const res = await axios.put(
                `${getBackendURL()}/partner_applications/reject`,
                {
                    application: application,
                },
                { headers: headers }
            );

            console.log(res);

            return res.data;
        } catch (error) {
            return error;
        }
    }
}
