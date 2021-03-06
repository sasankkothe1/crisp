/* eslint-disable indent */
import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    AppBar,
    InputAdornment,
    TextField,
    Toolbar,
    IconButton,
    MenuItem,
    Popper,
    MenuList,
    Grow,
    Paper,
    ClickAwayListener,
    makeStyles,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SearchIcon from "@material-ui/icons/Search";
import Logo from "../../assets/logo.png";
import { logout } from "../../redux/actions";

import { isLoggedIn, isPartner, isAdmin } from "../../services/utils";

const useStyles = makeStyles((theme) => ({
    header: {
        flexGrow: 1,
        backgroundColor: "#FFFFFF",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    logo: {
        maxWidth: theme.spacing(14),
    },
    searchBar: {
        flexGrow: 1,
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(4),
    },
    buttonGroup: {
        flexGrow: 1,
        display: "inline-flex",
        justifyContent: "flex-end",
        gap: theme.spacing(4),
    },
    icon: {
        fontSize: theme.spacing(4),
    },
}));

const Header = ({ history, location, dispatch }) => {
    const classes = useStyles();

    useEffect(async () => {
        if (location.pathname.split("/")[1] === "admin" && !isAdmin()) {
            history.push("/");
        }
    }, [location.pathname]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [openAuth, setOpenAuth] = useState(false);

    const handleMenu = (event) => {
        const openMenu = event.currentTarget.getAttribute("aria-controls");
        setOpenAdd(openMenu === "menu-list-add");
        setOpenAuth(openMenu === "menu-list-auth");
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setOpenAdd(false);
        setOpenAuth(false);
        setAnchorEl(null);
    };

    const redirect = (path) => {
        handleClose();
        history.push(path);
    };

    const onClickSearch = useCallback(() => {
        const link = `/search?text=${searchValue}`;
        history.push(encodeURI(link));
    }, [history]);

    const onLogout = (e) => {
        e.preventDefault();
        handleClose();
        dispatch(logout());
        history.push("/");
        window.location.reload();
    };

    return (
        <div>
            <AppBar className={classes.header} positioning="static">
                <Toolbar className={classes.toolbar}>
                    <Link to="/">
                        <img src={Logo} className={classes.logo} />
                    </Link>
                    <TextField
                        className={classes.searchBar}
                        placeholder="Search???"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onClickSearch}
                                        color="inherit"
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            "aria-label": "search",
                        }}
                        onChange={(event) => {
                            setSearchValue(event.target.value);
                        }}
                    />
                    <div className={classes.buttonGroup}>
                        <IconButton
                            aria-label="add post, event, recipe or recipe collection"
                            aria-controls="menu-list-add"
                            aria-haspopup="true"
                            onClick={handleMenu}
                        >
                            <AddCircleOutlineIcon className={classes.icon} />
                        </IconButton>
                        <Popper
                            open={openAdd}
                            anchorEl={anchorEl}
                            role={undefined}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: "center bottom",
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener
                                            onClickAway={handleClose}
                                        >
                                            <MenuList
                                                autoFocusItem={openAdd}
                                                id="menu-list-add"
                                            >
                                                <MenuItem
                                                    onClick={() =>
                                                        redirect("/addPost")
                                                    }
                                                >
                                                    Add Post
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() =>
                                                        redirect("/addRecipe")
                                                    }
                                                >
                                                    Add Recipe
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() =>
                                                        redirect("/addEvent")
                                                    }
                                                >
                                                    Add Event
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() =>
                                                        redirect(
                                                            "/addRecipeCollection"
                                                        )
                                                    }
                                                >
                                                    Add Recipe Collection
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                        <IconButton
                            aria-label="account of current user"
                            aria-haspopup="true"
                            onClick={() => redirect("/shop")}
                        >
                            <ShoppingCartIcon className={classes.icon} />
                        </IconButton>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-list-auth"
                            aria-haspopup="true"
                            onClick={handleMenu}
                        >
                            <AccountCircle className={classes.icon} />
                        </IconButton>
                        <Popper
                            open={openAuth}
                            anchorEl={anchorEl}
                            role={undefined}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: "center bottom",
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener
                                            onClickAway={handleClose}
                                        >
                                            {isLoggedIn() ? (
                                                <MenuList
                                                    autoFocusItem={openAuth}
                                                    id="menu-list-auth"
                                                >
                                                    <MenuItem
                                                        onClick={() =>
                                                            redirect("/profile")
                                                        }
                                                    >
                                                        My Profile
                                                    </MenuItem>
                                                    {!isPartner() &&
                                                        !isAdmin() && (
                                                            <MenuItem
                                                                onClick={() =>
                                                                    redirect(
                                                                        "/partnershipApplication"
                                                                    )
                                                                }
                                                            >
                                                                Apply for
                                                                Partnership
                                                            </MenuItem>
                                                        )}
                                                    <MenuItem
                                                        onClick={onLogout}
                                                    >
                                                        Logout
                                                    </MenuItem>
                                                </MenuList>
                                            ) : (
                                                <MenuList
                                                    autoFocusItem={openAuth}
                                                    id="menu-list-auth"
                                                >
                                                    <MenuItem
                                                        onClick={() =>
                                                            redirect("/login")
                                                        }
                                                    >
                                                        Login
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() =>
                                                            redirect(
                                                                "/register"
                                                            )
                                                        }
                                                    >
                                                        Register
                                                    </MenuItem>
                                                </MenuList>
                                            )}
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

Header.propTypes = {
    history: History,
    dispatch: PropTypes.func,
};

export default connect()(withRouter(Header));
