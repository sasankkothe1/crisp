import React from "react";
import { useParams } from "react-router-dom";
import AddRecipeView from "../Recipe/AddRecipeView";

export default function EditRecipe() {
    let { id } = useParams();
    return (
        <div>
            <AddRecipeView recipeID={id} editable={true} />
        </div>
    );
}
