import React, { useState } from "react";

import { Modal } from "react-bootstrap";
import PostTile from "../Post/PostTile";
import PostModal from "../Post/PostModal";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    post: {
        overflowY: "scroll",
        padding: "25px 25px 0",
        columnCount: 2,
        gridColumnGap: "1em",
        columnGap: "1em",
        width: "90%",
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
            {recipeCollectionsData.map((rc, i) => {
                const rcProps = {
                    price: rc.price,
                    purchased: rc.purchased,
                };
                return (
                    <PostTile
                        onClick={() => displayPost(i)}
                        key={i}
                        data={rc}
                        rcProps={rcProps}
                    />
                );
            })}
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
