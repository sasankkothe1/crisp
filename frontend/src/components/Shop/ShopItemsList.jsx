import React, { useState } from "react";
//import ShopItem from "./ShopItem";

import { Modal } from "react-bootstrap";
import PostTile from "../Post/PostTile";
import PostModal from "../Post/PostModal";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    post: {
        overflowY: "scroll",
        padding: "2em 10em 0 10em",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        flexShrink: "1",
    },
}));

export default function ShopItemsList(props) {
    const classes = useStyles();

    const recipeCollectionsData = props["data"];

    const [show, setShow] = useState(false);
    const [postIndex, setPostIndex] = useState(0);

    const handleClose = () => setShow(false);

    const displayPost = (i) => {
        setPostIndex(i);
        setShow(true);
    };

    return (
        <div className={classes.post}>
            {recipeCollectionsData.map((rc, i) => (
                <PostTile onClick={() => displayPost(i)} key={i} data={rc} />
            ))}
            <Modal
                size={"lg"}
                scrollable
                centered
                show={show}
                onHide={handleClose}
            >
                <PostModal data={recipeCollectionsData[postIndex]} />
            </Modal>
        </div>
    );
}
