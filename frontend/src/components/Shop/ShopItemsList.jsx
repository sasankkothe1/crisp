import React from "react";
import ShopItem from "./ShopItem";

export default function ShopItemsList(props) {
    const recipeCollectionsData = props["data"];

    return (
        <div>
            {recipeCollectionsData.map((rc, i) => (
                <ShopItem key={i} data={rc} />
            ))}
        </div>
    );
}
