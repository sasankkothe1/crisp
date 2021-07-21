import React from "react";
import PropTypes from "prop-types";
import {
    makeStyles,
    Typography,
    Card,
    CardHeader,
    CardContent,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 2,
        marginLeft: theme.spacing(2),
    },
    CardHeader: {
        backgroundColor: "#F9EACE",
    },
    CardContent: {
        padding: theme.spacing(1),
    },
}));

const ProfileDetails = ({ user }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardHeader
                title={
                    <>
                        <PersonIcon /> <span>Details</span>
                    </>
                }
                className={classes.CardHeader}
            />
            <CardContent>
                <Typography variant="h5">{`username: ${user?.username}`}</Typography>
                <Typography variant="h5">{`name: ${user?.firstName} ${user?.lastName}`}</Typography>
            </CardContent>
        </Card>
    );
};

ProfileDetails.propTypes = {
    user: PropTypes.object,
};

export default ProfileDetails;
