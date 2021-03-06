import axios from "axios";
import { getToken } from "./utils";
export default class RecipeCollectionService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}/recipe_collections`;
    }

    static async getRecipeCollectionLink(id) {
        try {
            const token = getToken();

            if (!token) {
                return {
                    status: 401,
                };
            }

            const headers = { Authorization: `Bearer ${token}` };

            const res = await axios.get(
                `${RecipeCollectionService.baseURL()}/${id}/link`,
                { headers }
            );

            return res;
        } catch (error) {
            return error;
        }
    }

    static async getRecipeCollections(
        limit,
        page,
        recipeType,
        meal,
        minPrice,
        maxPrice
    ) {
        try {
            const token = getToken();

            let url = `${RecipeCollectionService.baseURL()}`;

            let params = {
                page: page,
                limit: limit,
            };

            if (recipeType) {
                params.recipe_type = recipeType;
            }
            if (meal) {
                params.meal = meal;
            }
            if (minPrice) {
                params.min_price = minPrice;
            }
            if (maxPrice && maxPrice != 999999999) {
                params.max_price = maxPrice;
            }

            let headers = {};
            if (token) {
                headers = {
                    ...headers,
                    Authorization: `Bearer ${token}`,
                };
            }

            const res = await axios.get(url, {
                headers: headers,
                params: params,
            });

            return res;
        } catch (error) {
            return error;
        }
    }

    static async addRecipeCollection(recipeCollection) {
        let token = getToken();
        if (!token) {
            return {
                status: 401,
            };
        }
        let headers = { Authorization: `Bearer ${token}` };

        try {
            const res = await axios.post(
                `${RecipeCollectionService.baseURL()}`,
                recipeCollection,
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
