import axios from "axios";
import { getToken } from "./utils";

export default class RecipeService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}`;
    }

    static async addRecipe(recipe) {
        let res = null;
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };
        try {
            res = await axios.post(
                `${RecipeService.baseURL()}/recipes/addRecipe`,
                recipe,
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
