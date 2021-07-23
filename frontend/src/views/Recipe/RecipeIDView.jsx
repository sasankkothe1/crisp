import React from "react";
import { useParams } from "react-router-dom";
import AddRecipeView from "./AddRecipeView";

export default function RecipeIDView() {
    let { id } = useParams();
    return (
        <div>
            <AddRecipeView recipeID={id} />
        </div>
    );
}
