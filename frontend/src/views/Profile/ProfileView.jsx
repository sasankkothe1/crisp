import React, { useEffect, useState } from "react";
import { withRouter, useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import {
    makeStyles,
    useTheme,
    Grid,
    Tabs,
    Tab,
    AppBar,
    Card,
} from "@material-ui/core";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileDetails from "../../components/Profile/ProfileDetails";
import TabPanel from "../../components/Profile/TabPanel";
import PostsList from "../../components/HomePage/PostsList";
import UserService from "../../services/UserService";

// import { postData } from "../../SampleData/postData";

import PostService from "../../services/PostService";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "90vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    topContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
    },
    botContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: theme.spacing(5),
    },
    tabsContainer: {
        width: "fit-content",
        display: "flex",
    },
    postListContainer: {
        marginTop: theme.spacing(5),
    },
}));

function ProfileView({ history }) {
    const classes = useStyles();
    const theme = useTheme();

    let { id } = useParams();

    const currentUser = useSelector((state) => state.user);

    const [user, setUser] = useState();
    const [tabIndex, setTabIndex] = useState(0);
    const [data, setData] = useState([]);

    useEffect(async () => {
        if (id) {
            setUser(await UserService.getUserDetails(id));
        } else {
            if (currentUser._id) {
                setUser(await UserService.getUserDetails(currentUser._id));
            } else {
                history.push("/");
            }
        }
    }, []);

    useEffect(() => {
        PostService.allPosts().then((res) => {
            setData(res);
        });
    }, []);

    const handleChange = (event, newTabsValue) => {
        setTabIndex(newTabsValue);
    };

    const handleChangeIndex = (index) => {
        setTabIndex(index);
    };

    return (
        <Grid container className={classes.root}>
            <Grid item container className={classes.topContainer}>
                <ProfileHeader
                    recipeCount={user?.recipes.length || 0}
                    following={user?.following || []}
                    followers={user?.followers || []}
                />
                <ProfileDetails
                    user={{
                        username: user?.username || "",
                        firstName: user?.firstName || "",
                        lastName: user?.lastName || "",
                    }}
                />
            </Grid>
            <Grid item className={classes.botContainer}>
                <AppBar
                    position="static"
                    color="secondary"
                    className={classes.tabsContainer}
                >
                    <Tabs
                        value={tabIndex}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs"
                    >
                        <Tab
                            label="Recipes"
                            id="full-width-tab-0"
                            aria-controls="full-width-tabpanel-0"
                        />
                        <Tab
                            label="Posts"
                            id="full-width-tab-1"
                            aria-controls="full-width-tabpanel-1"
                        />
                        <Tab
                            label="Events"
                            id="full-width-tab-2"
                            aria-controls="full-width-tabpanel-2"
                        />
                    </Tabs>
                </AppBar>
                <Card>
                    <SwipeableViews
                        axis={"x"}
                        index={tabIndex}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel
                            value={tabIndex}
                            index={0}
                            dir={theme.direction}
                        >
                            <PostsList data={data} />
                        </TabPanel>
                        <TabPanel
                            value={tabIndex}
                            index={1}
                            dir={theme.direction}
                        >
                            <PostsList data={data} />
                        </TabPanel>
                        <TabPanel
                            value={tabIndex}
                            index={2}
                            dir={theme.direction}
                        >
                            <PostsList data={data} />
                        </TabPanel>
                    </SwipeableViews>
                </Card>
            </Grid>
        </Grid>
    );
}

ProfileView.propTypes = {
    history: History,
};

export default connect()(withRouter(ProfileView));
