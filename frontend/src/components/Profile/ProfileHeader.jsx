import React from "react";
import PropTypes from "prop-types";
import {
    makeStyles,
    Typography,
    Card,
    CardHeader,
    CardContent,
    Grid,
    Button,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { isLoggedIn } from "../../services/utils";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        marginRight: theme.spacing(2),
    },
    CardHeader: {
        backgroundColor: "#F9EACE",
    },
    Container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    SubscribeButton: {
        marginLeft: theme.spacing(1),
    },
}));

const ProfileHeader = ({
    counts,
    isLoggedInUser,
    isFollowing,
    isSubscribed,
    isPartner,
    onFollow,
    onUnfollow,
    onSubscribe,
}) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardHeader
                title={
                    <>
                        <PersonIcon /> <span>Profile</span>
                    </>
                }
                action={
                    isLoggedIn &&
                    !isLoggedInUser && (
                        <>
                            {isFollowing ? (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={(e) => {
                                        onUnfollow(e);
                                    }}
                                >
                                    Unfollow
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    onClick={(e) => {
                                        onFollow(e);
                                    }}
                                >
                                    Follow
                                </Button>
                            )}
                            {isPartner && !isSubscribed && (
                                <Button
                                    className={classes.SubscribeButton}
                                    onClick={() => {
                                        onSubscribe(true);
                                    }}
                                >
                                    Subscribe
                                </Button>
                            )}
                        </>
                    )
                }
                className={classes.CardHeader}
            />
            <CardContent>
                <Grid container className={classes.Container}>
                    <Grid item>
                        <Typography variant="h5">{`${counts.recipeCount} Recipes`}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">{`${counts.postCount} Posts`}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">{`${counts.eventCount} Events`}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

ProfileHeader.propTypes = {
    counts: PropTypes.object,
    isLoggedInUser: PropTypes.bool,
    isFollowing: PropTypes.bool,
    isSubscribed: PropTypes.bool,
    isPartner: PropTypes.bool,
    onFollow: PropTypes.func,
    onUnfollow: PropTypes.func,
    onSubscribe: PropTypes.func,
};

export default ProfileHeader;
