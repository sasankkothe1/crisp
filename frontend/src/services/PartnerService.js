import axios from "axios";
import { getToken, getBackendURL } from "./utils";

export default class PartnerService {
    static async createPartnershipApplication() {
        try {
            let headers = { Authorization: `Bearer ${getToken()}` };
            const res = await axios.post(
                `${getBackendURL()}/partner_applications/create`,
                {},
                { headers: headers }
            );

            console.log("createPartnershipApplication");
            console.log(res.data);

            return res.data;
        } catch (error) {
            return error;
        }
    }

    static async getPartnershipApplication() {
        try {
            let headers = { Authorization: `Bearer ${getToken()}` };
            const res = await axios.get(
                `${getBackendURL()}/partner_applications/getById`,
                { headers: headers }
            );

            console.log("getPartnershipApplication");
            console.log(res.data);

            return res.data;
        } catch (error) {
            return error;
        }
    }
}
