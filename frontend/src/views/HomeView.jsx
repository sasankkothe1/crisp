import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import PostsList from "../components/HomePage/PostsList";
import SideBar from "../components/HomePage/SideBar";
import PostService from "../services/PostService";

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
    const [data, setData] = useState([]);

    useEffect(() => {
        PostService.allPosts().then((res) => {
            setData(res);
        });
    }, []);

    return (
        <div className={classes.homeViewContainer}>
            <div className={classes.homeViewPostList}>
                {data.length > 0 ? <PostsList data={data} /> : <h1>Loading</h1>}
            </div>
            <div className={classes.homeViewSideBar}>
                <SideBar />
            </div>
        </div>
    );
}
