import React from "react";
import PropTypes from "prop-types";
import { Grid, makeStyles } from "@material-ui/core";
import Header from "../components/Header/Header";
import Banner from "../components/Banner/Banner";

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
}));

const MainLayout = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <header>
                <Header />
            </header>
            <main>
                <Grid container className={classes.container}>
                    <Grid item>
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
};

export default MainLayout;
