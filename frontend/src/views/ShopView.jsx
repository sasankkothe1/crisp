import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";

import ShopSidebar from "../components/Shop/ShopSidebar";
import ShopHeader from "../components/Shop/ShopHeader";
import ShopItemsList from "../components/Shop/ShopItemsList";

const useStyles = makeStyles(() => ({
    shopContainer: {
        width: "1500px",
        display: "flex",
        flexDirection: "column",
    },
    shop: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
    },
    shopSidebar: {
        width: "20%",
        display: "flex",
    },
    shopItemsList: {
        width: "80%",
        display: "flex",
    },
}));

export default function ShopView() {
    const classes = useStyles();

    const [dataChanged, setDataChanged] = useState(false);

    const [recipeType, setRecipeType] = useState("");

    const [buttonClicked, setButtonClicked] = useState(false);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(999999999);

    const [meal, setMeal] = useState("");

    const sidebarProps = {
        meal: meal,
        setMeal: setMeal,
        setMinPrice: setMinPrice,
        setMaxPrice: setMaxPrice,
        buttonClicked: buttonClicked,
        setButtonClicked: setButtonClicked,
    };

    const headerProps = {
        recipeType: recipeType,
        setRecipeType: setRecipeType,
    };

    const listProps = {
        dataChanged: dataChanged,
        setDataChanged: setDataChanged,
        recipeType: recipeType,
        meal: meal,
        minPrice: minPrice,
        maxPrice: maxPrice,
        buttonClicked: buttonClicked,
        limit: 6,
    };

    return (
        <div className={classes.shopContainer}>
            <ShopHeader {...headerProps} />
            <div className={classes.shop}>
                <div className={classes.shopSidebar}>
                    <ShopSidebar {...sidebarProps} />
                </div>
                <div className={classes.shopItemsList}>
                    <ShopItemsList {...listProps} />
                </div>
            </div>
        </div>
    );
}
