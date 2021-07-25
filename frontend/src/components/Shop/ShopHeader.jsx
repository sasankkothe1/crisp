import React from "react";

import { Toolbar, makeStyles, IconButton, Grid } from "@material-ui/core";

import Icon from "@material-ui/core/Icon";

import { tagTypes } from "./tagTypes";

const useStyles = makeStyles((theme) => ({
    divContainer: {
        width: "100%",
        flexGrow: 1,
    },
    shopToolbar: {
        width: "100%",
        flexGrow: 1,
        justifyContent: "flex",
        backgroundColor: "#FFA500",
    },
    icon: {
        fontSize: theme.spacing(4),
        fontFamily: "Material Icons!important",
    },
}));

const ShopHeader = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.divContainer}>
            <Toolbar className={classes.shopToolBar}>
                {tagTypes.map((tagType, i) => (
                    <Grid
                        key={i}
                        container
                        direction="column"
                        alignItems="center"
                    >
                        <Grid item>
                            <IconButton
                                onClick={() => {
                                    props.recipeType == tagTypes["type"]
                                        ? props.setRecipeType("")
                                        : props.setRecipeType(tagType["type"]);
                                }}
                            >
                                <Icon className={classes.icon}>
                                    {tagType["icon"]}
                                </Icon>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <span>{tagType["caption"]}</span>
                        </Grid>
                    </Grid>
                ))}
            </Toolbar>
        </div>
    );
};

export default ShopHeader;
