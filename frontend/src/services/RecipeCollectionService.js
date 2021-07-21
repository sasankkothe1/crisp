import axios from "axios";

export default class RecipeCollectionService {
    static baseURL() {
        return "localhost:3000/api/recipe_collection";
    }

    static async getRecipeCollection(id) {
        try {
            const res = await axios.get(
                `${RecipeCollectionService.baseURL()}/${id}`
            );
            return res;
        } catch (error) {
            return error;
        }
    }

    static async getRecipeCollections() {
        try {
            const res = await axios.get(`${RecipeCollectionService.baseURL()}`);
            return res;
        } catch (error) {
            return error;
        }
    }
}
