import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import {
    makeStyles,
    Paper,
    TextField,
    Button,
    Typography,
} from "@material-ui/core";
import { login } from "../redux/actions";

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

function UserLoginView({ history, dispatch }) {
    const classes = useStyles();

    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (user._id) {
            history.push("/");
        }
    }, [user, history]);

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [loginError, setLoginError] = React.useState("");

    const onLogin = (e) => {
        e.preventDefault();
        dispatch(login(username, password));
        history.push("/");
    };

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
        setLoginError("");
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
        setLoginError("");
    };

    const onCancel = () => {
        history.push("/");
    };

    const onSignUp = () => {
        history.push("/register");
    };

    return (
        <div className={classes.userLoginRoot}>
            <Paper className={classes.loginPaper} component="form">
                <div className={classes.loginRow}>
                    <TextField
                        label="Username"
                        fullWidth
                        value={username}
                        onChange={onChangeUsername}
                        error={loginError !== ""}
                    />
                </div>
                <div className={classes.loginRow}>
                    <TextField
                        label="Password"
                        fullWidth
                        value={password}
                        onChange={onChangePassword}
                        error={loginError !== ""}
                        type="password"
                    />
                </div>
                {loginError !== "" ? (
                    <div className={classes.loginRow}>
                        <Typography color="error">{loginError}</Typography>
                    </div>
                ) : null}
                <div className={classes.loginRow + " " + classes.loginButtons}>
                    <Button onClick={onSignUp}>Not Registered yet?</Button>
                    <div>
                        <Button
                            className={classes.loginButton}
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={classes.loginButton}
                            variant="contained"
                            color="primary"
                            onClick={onLogin}
                            disabled={username === "" || password === ""}
                            type="submit"
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </Paper>
        </div>
    );
}

UserLoginView.propTypes = {
    history: History,
    dispatch: PropTypes.func,
};

export default connect()(withRouter(UserLoginView));
