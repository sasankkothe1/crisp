import React from "react";
import { makeStyles } from "@material-ui/core";
import PostsList from "../components/HomePage/PostsList";
import SideBar from "../components/HomePage/SideBar";

import { postData } from "../SampleData/postData";

const useStyles = makeStyles((theme) => ({
    homeViewContainer: {
        display: "flex",
        flexDirection: "row",
        height: "100%",
        marginTop: theme.spacing(-2),
    },
    homeViewPostList: {
        flexGrow: 2,
    },

    homeViewSideBar: {
        width: "30%",
        flexGrow: 1,
    },
}));

export default function HomeView() {
    const classes = useStyles();

    return (
        <div className={classes.homeViewContainer}>
            <div className={classes.homeViewPostList}>
                <PostsList data={postData} />
            </div>
            <div className={classes.homeViewSideBar}>
                <SideBar />
            </div>
        </div>
    );
}
