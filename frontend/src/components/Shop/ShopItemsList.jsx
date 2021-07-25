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

    const { recipeCollectionsData, dataChanged, setDataChanged } = props;

    const [show, setShow] = useState(false);
    const [rcIndex, setRCIndex] = useState(0);

    const handleClose = () => setShow(false);

    const displayRC = (i) => {
        setRCIndex(i);
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
                        onClick={() => displayRC(i)}
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
                <PostModal
                    data={recipeCollectionsData[rcIndex]}
                    dataChanged={dataChanged}
                    setDataChanged={setDataChanged}
                    postType="RecipeCollection"
                />
            </Modal>
        </div>
    );
}
