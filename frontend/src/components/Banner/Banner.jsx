import React from "react";
import Background from "./background.jpg";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles(() => ({
    background: {
        maxWidth: "100%",
        maxHeight: "25%",
    },
}));

function Banner() {
    const classes = useStyles();
    return (
        <div className="banner-container">
            <img src={Background} className={classes.background} />
        </div>
    );
}

export default Banner;
