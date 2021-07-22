import axios from "axios";
import { getToken } from "./utils";
export default class RecipeCollectionService {
    static baseURL() {
        return `${process.env.REACT_APP_BACKEND_URL}/recipe_collections`;
    }

    static async getRecipeCollection(id) {
        try {
            const token = getToken();
            const headers = { Authorization: `Bearer ${token}` };

            const res = await axios.get(
                `${RecipeCollectionService.baseURL()}/${id}`, { headers }
            );

            return res;
        } catch (error) {
            return error;
        }
    }

    static async getRecipeCollections(recipeType, meal, minPrice, maxPrice) {
        try {
            const token = getToken();
            const headers = { Authorization: `Bearer ${token}` };

            let url = `${RecipeCollectionService.baseURL()}?populate=postedBy`;
            let cgi = "";
            if (recipeType) {
                cgi = cgi.concat(`&recipe_type=${recipeType}`);
            }
            if (meal) {
                cgi = cgi.concat(`&meal=${meal}`);
            } 
            if (minPrice) {
                cgi = cgi.concat(`&min_price=${minPrice}`);
            }
            if (maxPrice && maxPrice != 999999999) {
                cgi = cgi.concat(`&max_price=${maxPrice}`);
            }
            if (cgi) {
                url = url.concat(cgi);
                //url = url.concat('?', cgi.substring(1));
            }

            console.log(url);
            const res = await axios.get(url);

            console.log(res.status);
            console.log(res.data);

            return res;
        } catch (error) {
            return error;
        }
    }
}

