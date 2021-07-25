import React, { useState } from "react";
import { makeStyles, Button } from "@material-ui/core";
import PostsList from "../components/HomePage/PostsList";
import SideBar from "../components/HomePage/SideBar";
import PostService from "../services/PostService";
import { isLoggedIn } from "../services/utils";

const useStyles = makeStyles((theme) => ({
    homeViewContainer: {
        display: "flex",
        flexDirection: "row",
        height: "100%",
        marginTop: theme.spacing(-2),
    },
    homeViewPostList: {
        width: "80vw !important",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    button: {
        marginTop: theme.spacing(2),
    },

    homeViewSideBar: {
        width: "30%",
        flexGrow: 1,
    },
}));

export default function HomeView() {
    const classes = useStyles();

    const [isPersonalized, setIsPersonalized] = useState(false);

    return (
        <div className={classes.homeViewContainer}>
            <div className={classes.homeViewPostList}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setIsPersonalized(!isPersonalized);
                    }}
                    className={classes.button}
                >
                    {isPersonalized ? "Discover" : "Personalize"}
                </Button>

                {isPersonalized && isLoggedIn() ? (
                    <PostsList
                        editable={false}
                        limit={16}
                        fetchMethod={PostService.allPostsPersonalized}
                        fetchParams={{}}
                    />
                ) : (
                    <PostsList
                        editable={false}
                        limit={16}
                        fetchMethod={PostService.allPosts}
                        fetchParams={{}}
                    />
                )}
            </div>
            <div className={classes.homeViewSideBar}>
                <SideBar />
            </div>
        </div>
    );
}
