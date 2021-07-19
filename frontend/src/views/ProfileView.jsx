import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { makeStyles, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    userLoginRoot: {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    loginPaper: {
        width: "500px",
        padding: theme.spacing(2),
    },
    loginRow: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        "&:last-child": {
            paddingBottom: theme.spacing(0),
        },
        "&:first-child": {
            paddingTop: theme.spacing(0),
        },
    },
    loginButtons: {
        display: "flex",
        justifyContent: "space-between",
    },
    loginButton: {
        marginLeft: theme.spacing(1),
    },
}));

function UserLoginView({ history }) {
    const classes = useStyles();

    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (!user._id) {
            history.push("/");
        }
    }, [user, history]);

    return (
        <div className={classes.userLoginRoot}>
            <Paper className={classes.loginPaper} component="form">
                <div className={classes.loginRow}>
                    <Typography variant="h3">{`ID: ${user._id}`}</Typography>
                </div>
                <div className={classes.loginRow}>
                    <Typography variant="h3">{`Username: ${user.username}`}</Typography>
                </div>
                <div className={classes.loginRow}>
                    <Typography variant="h3">{`Role: ${user.role}`}</Typography>
                </div>
            </Paper>
        </div>
    );
}

UserLoginView.propTypes = {
    history: History,
};

export default connect()(withRouter(UserLoginView));
