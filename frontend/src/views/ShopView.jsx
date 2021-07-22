import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core";

import ShopSidebar from "../components/Shop/ShopSidebar";
import ShopHeader from "../components/Shop/ShopHeader";
import ShopItemsList from "../components/Shop/ShopItemsList";

import { recipeCollectionsData } from "../SampleData/recipeCollectionsData";

import recipeCollectionService from "../services/RecipeCollectionService";

const useStyles = makeStyles((theme) => ({
    shopContainer: {
        width:"1000px",
        display: "flex",
        flexDirection: "column"
    },
    shop: {
        display: "flex",
        flexDirection: "row",
        width: "100%"
    },
    shopSidebar: {
        width: "20%",
        display: "flex"
    },
    shopItemsList: {
        width: "80%",
        display: "flex"
    }
}));

export default function ShopView() {
    const classes = useStyles();

    const [recipeType, setRecipeType] = useState("");

    const [buttonClicked, setButtonClicked] = useState(false);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(999999999);

    const [meal, setMeal] = useState("");

    const [rcd, setRCD] = useState([]);

    useEffect(async () => {
        console.log(recipeType, meal, minPrice, maxPrice);
        //const res = await recipeCollectionService.getRecipeCollections(recipeType, meal, minPrice, maxPrice);
        //setRCD(res.data);

        setRCD(recipeCollectionsData);

        /*
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
        */

    }, [recipeType, buttonClicked]);

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
        setRecipeType: setRecipeType
    };

    return (
        <div className={classes.shopContainer}>
            <ShopHeader {...headerProps} />
            <div className={classes.shop}>
                <div className={classes.shopSidebar}>
                    <ShopSidebar {...sidebarProps} />
                </div>
                <div className={classes.shopItemsList}>
                    <ShopItemsList data={rcd} />
                </div>
            </div>
        </div>
        // <div className="shop-container">
        //     <div className="shop-header-container">
        //         <ShopHeader {...headerProps} />
        //     </div>
        //     <div className="shop-main-container">
        //         <div className="shop-sidebar-container">
        //             <ShopSidebar {...sidebarProps} />
        //         </div>
        //         <div className="shop-items-list-container">
        //             <ShopItemsList data={rcd} />
        //         </div>
        //     </div>
        // </div>
    );
}
