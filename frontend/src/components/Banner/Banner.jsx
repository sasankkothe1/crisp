import React from "react";
import Background from "./background.jpg";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    background: {
        marginTop: theme.spacing(-2),
        objectFit: "cover",
        objectPosition: "right 20%",
        width: "100%",
        height: "20vh",
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
