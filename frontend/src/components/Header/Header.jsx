import React, { useState, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { withRouter, useHistory } from "react-router-dom";
import {
    AppBar,
    Typography,
    InputBase,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";

import "./Header.css";

const Header = () => {
    const history = useHistory();

    const [anchorEl, setAnchorEl] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        event.preventDefault();
        console.log("before");
        setAnchorEl(event.currentTarget);
        console.log("after");
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClickSearch = useCallback(() => {
        const link = `/search?text=${searchValue}`;
        history.push(encodeURI(link));
    }, [history]);

    return (
        <AppBar positioning="static">
            <Toolbar>
                <Typography variant="h4" noWrap>
                    This is Header
                </Typography>
                <InputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    endAdornment={
                        <IconButton onClick={onClickSearch} color="inherit">
                            <SearchIcon />
                        </IconButton>
                    }
                    onChange={(event) => {
                        setSearchValue(event.target.value);
                    }}
                />
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default withRouter(Header);
