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
import PaymentPortal from "../../components/Payment/PaymentPortal";

// import { postData } from "../../SampleData/postData";

import PostService from "../../services/PostService";
import EventService from "../../services/EventService";
import RecipeService from "../../services/RecipeService";

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
        zIndex: "auto",
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

    const loggedInUser = useSelector((state) => state.user);

    const [profileUser, setProfileUser] = useState({});
    const [isLoggedInUser, setIsLoggedInUser] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    // Payment Modal Condition
    const [show, setShow] = useState(false);

    useEffect(async () => {
        if (id) {
            setProfileUser(await UserService.getUserDetails(id));
            setIsLoggedInUser(id === loggedInUser._id);
            if (id != loggedInUser._id) {
                setIsFollowing(await UserService.isFollowing(id));
            }
        } else {
            if (loggedInUser._id) {
                setProfileUser(
                    await UserService.getUserDetails(loggedInUser._id)
                );
                setIsLoggedInUser(true);
            } else {
                history.push("/");
            }
        }
    }, []);

    const handleChange = (event, newTabsValue) => {
        setTabIndex(newTabsValue);
    };

    const handleChangeIndex = (index) => {
        setTabIndex(index);
    };

    const onFollow = async (e) => {
        e.preventDefault();

        const res = await UserService.followUser(profileUser._id);
        setIsFollowing(res);
    };

    const onUnfollow = async (e) => {
        e.preventDefault();

        const res = await UserService.unfollowUser(profileUser._id);
        setIsFollowing(res);
    };

    return (
        <>
            <Grid container className={classes.root}>
                <Grid item container className={classes.topContainer}>
                    <ProfileHeader
                        counts={{
                            recipeCount: 0,
                            postCount: 0,
                            eventCount: 0,
                        }}
                        isLoggedInUser={isLoggedInUser}
                        isFollowing={isFollowing}
                        onFollow={onFollow}
                        onUnfollow={onUnfollow}
                        onSubscribe={setShow}
                    />
                    <ProfileDetails
                        user={{
                            username: profileUser?.username || "",
                            firstName: profileUser?.firstName || "",
                            lastName: profileUser?.lastName || "",
                        }}
                    />
                </Grid>
                <Grid item className={classes.botContainer}>
                    <AppBar
                        position="sticky"
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
                                <PostsList
                                    limit={16}
                                    fetchMethod={
                                        RecipeService.allRecipesByUserID
                                    }
                                    editable={true}
                                    fetchParam={profileUser._id}
                                />
                            </TabPanel>
                            <TabPanel
                                value={tabIndex}
                                index={1}
                                dir={theme.direction}
                            >
                                <PostsList
                                    limit={16}
                                    fetchMethod={PostService.allPostByUserID}
                                    editable={true}
                                    fetchParam={profileUser._id}
                                />
                            </TabPanel>
                            <TabPanel
                                value={tabIndex}
                                index={2}
                                dir={theme.direction}
                            >
                                <PostsList
                                    limit={16}
                                    fetchMethod={EventService.allEventsByUserID}
                                    editable={true}
                                    fetchParam={profileUser._id}
                                />
                            </TabPanel>
                        </SwipeableViews>
                    </Card>
                </Grid>
            </Grid>
            {id && id != loggedInUser._id && (
                <PaymentPortal
                    orderType="Subscription"
                    orderObject={profileUser}
                    show={show}
                    setShow={setShow}
                />
            )}
        </>
    );
}

ProfileView.propTypes = {
    history: History,
};

export default connect()(withRouter(ProfileView));
