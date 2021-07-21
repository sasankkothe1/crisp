import React from "react";

import { Toolbar, makeStyles, IconButton, Grid } from "@material-ui/core";

import Icon from "@material-ui/core/Icon";

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

    const icons = [
        {
            icon: "local_pizza_icon",
            caption: "Pizza",
            type: "pizza",
        },
        {
            icon: "fastfood_icon",
            caption: "Fast Food",
            type: "fastfood",
        },
        {
            icon: "local_bar_icon",
            caption: "Drinks",
            type: "drinks",
        },
        {
            icon: "child_friendly",
            caption: "Children",
            type: "children",
        },
        {
            icon: "emoji_food_beverage",
            caption: "AF Drinks",
            type: "nadrinks",
        },
    ];

    return (
        <div className={classes.divContainer}>
            <Toolbar className={classes.shopToolBar}>
                {icons.map((icon, i) => (
                    <Grid
                        key={i}
                        container
                        direction="column"
                        alignItems="center"
                    >
                        <Grid item>
                            <IconButton
                                onClick={() =>
                                    props.setRecipeType(icon["type"])
                                }
                            >
                                <Icon className={classes.icon}>
                                    {icon["icon"]}
                                </Icon>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <span>{icon["caption"]}</span>
                        </Grid>
                    </Grid>
                ))}
            </Toolbar>
        </div>
    );
};

export default ShopHeader;
