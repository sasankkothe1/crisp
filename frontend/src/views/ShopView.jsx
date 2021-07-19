import React from "react";

import { makeStyles } from "@material-ui/core";

import ShopSidebar from "../components/Shop/ShopSidebar";
import ShopHeader from "../components/Shop/ShopHeader";

const useStyles = makeStyles(() => ({
    shop: {
        display: "flex",
        flexDirection: "row",
        height: 1,
    },
}));

export default function ShopView() {
    const classes = useStyles();

    return (
        <div>
            <ShopHeader />
            <div className={classes.shop}>
                <ShopSidebar />
            </div>
        </div>
    );
}
