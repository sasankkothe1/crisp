import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core";

import ShopSidebar from "../components/Shop/ShopSidebar";
import ShopHeader from "../components/Shop/ShopHeader";
import ShopItemsList from "../components/Shop/ShopItemsList";

import { recipeCollectionsData } from "../SampleData/recipeCollectionsData";

const useStyles = makeStyles(() => ({
    shop: {
        display: "flex",
        flexDirection: "row",
        height: 1,
    },
}));

export default function ShopView() {
    const classes = useStyles();

    const [recipeType, setRecipeType] = useState("");

    const [buttonClicked, setButtonClicked] = useState(false);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(999999999);

    const [meal, setMeal] = useState("");

    const [rcd, setRCD] = useState(recipeCollectionsData);

    useEffect(() => {
        console.log(recipeType, meal, minPrice, maxPrice);
        setRCD(
            recipeCollectionsData.filter((recipeCollection) => {
                console.log(recipeCollection);
                if (
                    recipeType &&
                    !recipeCollection["tags"].includes(recipeType)
                ) {
                    return false;
                }
                if (meal && recipeCollection["meal"] != meal) {
                    return false;
                }
                if (
                    minPrice > recipeCollection["price"] ||
                    recipeCollection["price"] > maxPrice
                ) {
                    return false;
                }
                return true;
            })
        );
    }, [recipeType, buttonClicked]);

    const sidebarProps = {
        meal: meal,
        setMeal: setMeal,
        setMinPrice: setMinPrice,
        setMaxPrice: setMaxPrice,
        buttonClicked: buttonClicked,
        setButtonClicked: setButtonClicked,
    };

    return (
        <div>
            <ShopHeader setRecipeType={setRecipeType} />
            <div className={classes.shop}>
                <div>
                    <ShopSidebar {...sidebarProps} />
                </div>
                <div>
                    <ShopItemsList data={rcd} />
                </div>
            </div>
        </div>
    );
}
