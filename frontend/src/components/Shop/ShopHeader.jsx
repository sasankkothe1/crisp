import React, { useState, useEffect } from "react";

import { Toolbar, IconButton, makeStyles } from "@material-ui/core";

import LocalPizzaIcon from '@material-ui/icons/LocalPizza';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import LocalBarIcon from '@material-ui/icons/LocalBar';

const useStyles = makeStyles((theme) => ({
    shopToolbar: {
        flexGrow: 1,
        justifyContent: "space-between",
        backgroundColor: "#FFA500",
    },
    icon: {
        fontSize: theme.spacing(4),
    },
}));

const ShopHeader = () => {
    const classes = useStyles();

    const [type, setType] = useState("");

    useEffect(() => {
        if (type) {
            alert(`${type}? Good choice!`);
        }
    }, [type]);

    return (
        <div>
            <Toolbar className={classes.shopToolbar}>
                <IconButton onClick={() => setType("pizza")} color="white">
                    <LocalPizzaIcon className={classes.icon} />
                </IconButton>
                <IconButton onClick={() => setType("fastfood")} color="white">
                    <FastfoodIcon className={classes.icon} />
                </IconButton>
                <IconButton onClick={() => setType("drinkz")} color="white">
                    <LocalBarIcon className={classes.icon} />
                </IconButton>
            </Toolbar>
        </div>
    );
};

export default ShopHeader;
