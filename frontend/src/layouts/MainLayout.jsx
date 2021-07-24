import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, makeStyles } from "@material-ui/core";
import Header from "../components/Header/Header";
import Banner from "../components/Banner/Banner";
import { isTokenValid } from "../services/utils";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
    },
    container: {
        marginTop: theme.spacing(10),
        display: "flex",
        justifyContent: "center",
    },
    content: {
        marginTop: theme.spacing(2),
    },
    bannerGrid: {
        width: "100%",
    },
}));

const MainLayout = ({ children }) => {
    const classes = useStyles();

    useEffect(() => {
        isTokenValid();
    }, []);

    return (
        <div className={classes.root}>
            <header>
                <Header />
            </header>
            <main>
                <Grid container className={classes.container}>
                    <Grid item className={classes.bannerGrid}>
                        <Banner />
                    </Grid>
                    <Grid item className={classes.content}>
                        {children}
                    </Grid>
                </Grid>
            </main>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.any,
    location: PropTypes.object,
};

export default MainLayout;
