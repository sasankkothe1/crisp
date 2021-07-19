import React, { useState, useEffect } from "react";

import { Toolbar, makeStyles, IconButton, Grid } from "@material-ui/core";

//import LocalPizzaIcon from '@material-ui/icons/LocalPizza';
//import FastfoodIcon from '@material-ui/icons/Fastfood';
//import LocalBarIcon from '@material-ui/icons/LocalBar';
//import LinkIcon from '@material-ui/icons/Link';

//import * as MuiIcons from '@material-ui/icons';

import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles((theme) => ({
    divContainer: {
        width: 100
    },
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

    const icons = [
        {
            'icon': 'LocalPizzaIcon',
            'caption': 'Pizza',
            'type': 'pizza'
        },
        {
            'icon': 'FastfoodIcon',
            'caption': 'Fast Food',
            'type': 'fastfood'
        },
        {
            'icon': 'LocalBarIcon',
            'caption': 'Alcohol Drinks',
            'type': 'drinks'
        },
        {
            'icon': 'ChildFriendly',
            'caption': 'Children',
            'type': 'children'
        },
        {
            'icon': 'EmojiFoodBeverage',
            'caption': 'Alcohol-Free Drinks',
            'type': 'nadrinks'
        }
    ];

    return (
        <div>
            <Toolbar className={classes.shopToolBar}>
                {icons.map((icon, i) =>( 
                    <Grid key={i} container direction="column" alignItems="center">
                        <Grid item>
                            <IconButton>
                                <Icon onClick={() => setType(icon['type'])} className={classes.icon}>{icon['icon']}</Icon>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <span>{icon['caption']}</span>
                        </Grid>
                    </Grid>
                ))}
            </Toolbar>
        </div>
    );
};

export default ShopHeader;
