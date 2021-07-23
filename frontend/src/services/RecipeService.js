import axios from "axios";
import { getLoggedInUserID, getToken } from "./utils";

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

    static async allRecipes(limit, page) {
        let res = null

        try {
            res = await axios.get(`${RecipeService.baseURL()}/recipes/`, {
                params: {
                    limit: limit,
                    page: page,
                }
            })
            return res.data
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            };
        }
    }

    static async recipeById(id) {
        let res = null
        try {
            res = await axios.get(`${RecipeService.baseURL()}/recipes/recipeById/${id}`)
            return res.data
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            };
        }
    }


    static async allRecipesByUserID(limit, page) {
        let res = null
        const userID = getLoggedInUserID();
        let token = getToken();
        let headers = { Authorization: `Bearer ${token}` };

        try {
            res = await axios.get(`${RecipeService.baseURL()}/recipes/postedBy/${userID}`, {
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
