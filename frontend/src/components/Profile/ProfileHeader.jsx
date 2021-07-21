import React from "react";
import PropTypes from "prop-types";
import {
    makeStyles,
    Typography,
    Card,
    CardHeader,
    CardContent,
    Grid,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";

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
}));

const ProfileHeader = ({ recipeCount, following, followers }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardHeader
                title={
                    <>
                        <PersonIcon /> <span>Profile</span>
                    </>
                }
                className={classes.CardHeader}
            />
            <CardContent>
                <Grid container className={classes.Container}>
                    <Grid item>
                        <Typography variant="h5">{`recipes: ${recipeCount}`}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">{`following: ${following?.length}`}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">{`followers: ${followers?.length}`}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

ProfileHeader.propTypes = {
    recipeCount: PropTypes.number,
    following: PropTypes.array,
    followers: PropTypes.array,
};

export default ProfileHeader;
