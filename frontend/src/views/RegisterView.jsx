import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import {
    Paper,
    Button,
    TextField,
    Typography,
    makeStyles,
} from "@material-ui/core";

import { register } from "../redux/actions";

const useStyles = makeStyles((theme) => ({
    registerRoot: {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    registerPaper: {
        width: "500px",
        padding: theme.spacing(2),
    },
    registerUpRow: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        "&:last-child": {
            paddingBottom: theme.spacing(0),
        },
        "&:first-child": {
            paddingTop: theme.spacing(0),
        },
    },
    registerButtons: {
        display: "flex",
        justifyContent: "flex-end",
    },
    registerButton: {
        marginLeft: theme.spacing(1),
    },
}));

const RegisterView = ({ history, dispatch }) => {
    const classes = useStyles();

    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (user._id) {
            history.push("/");
        }
    }, [user, history]);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [registerError, setRegisterError] = useState("");

    const onRegister = (e) => {
        e.preventDefault();
        dispatch(register(firstName, lastName, username, email, password));
    };

    const onCancel = () => {
        history.push("/");
    };

    const onChangeFirstName = (e) => {
        setFirstName(e.target.value);
        setRegisterError("");
    };

    const onChangeLastName = (e) => {
        setLastName(e.target.value);
        setRegisterError("");
    };

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
        setRegisterError("");
    };

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
        setRegisterError("");
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
        setRegisterError("");
    };

    const onChangePassword2 = (e) => {
        setPassword2(e.target.value);
        setRegisterError("");
    };

    const onBlurPassword = () => {
        if (password !== "" && password2 !== "") {
            if (password !== password2) {
                setRegisterError("Passwords do not match.");
            } else {
                setRegisterError("");
            }
        }
    };

    return (
        <div className={classes.registerRoot}>
            <Paper className={classes.registerPaper} component="form">
                <div className={classes.registerRow}>
                    <Typography variant="h4" align="center">
                        Welcome to CRiSP!
                    </Typography>
                </div>
                <div className={classes.registerRow}>
                    <TextField
                        label="First Name"
                        fullWidth
                        value={firstName}
                        onChange={onChangeFirstName}
                    />
                </div>
                <div className={classes.registerRow}>
                    <TextField
                        label="Last Name"
                        fullWidth
                        value={lastName}
                        onChange={onChangeLastName}
                    />
                </div>
                <div className={classes.registerRow}>
                    <TextField
                        label="Username"
                        fullWidth
                        value={username}
                        onChange={onChangeUsername}
                    />
                </div>
                <div className={classes.registerRow}>
                    <TextField
                        label="E-Mail"
                        fullWidth
                        value={email}
                        onChange={onChangeEmail}
                    />
                </div>
                <div className={classes.registerRow}>
                    <TextField
                        label="Password"
                        fullWidth
                        value={password}
                        onChange={onChangePassword}
                        error={registerError !== ""}
                        onBlur={onBlurPassword}
                        type="password"
                    />
                </div>
                <div className={classes.registerRow}>
                    <TextField
                        label="Repeat Password"
                        fullWidth
                        value={password2}
                        onChange={onChangePassword2}
                        error={registerError !== ""}
                        onBlur={onBlurPassword}
                        type="password"
                    />
                </div>
                {registerError !== "" ? (
                    <div className={classes.registerRow}>
                        <Typography color="error">{registerError}</Typography>
                    </div>
                ) : null}
                <div
                    className={
                        classes.registerRow + " " + classes.registerButtons
                    }
                >
                    <Button
                        className={classes.registerButton}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.registerButton}
                        variant="contained"
                        color="primary"
                        onClick={onRegister}
                        disabled={
                            username === "" ||
                            password === "" ||
                            password2 === "" ||
                            registerError !== "" ||
                            password !== password2
                        }
                        type="submit"
                    >
                        Register
                    </Button>
                </div>
            </Paper>
        </div>
    );
};

RegisterView.propTypes = {
    history: History,
    dispatch: PropTypes.func,
};

export default connect()(withRouter(RegisterView));
