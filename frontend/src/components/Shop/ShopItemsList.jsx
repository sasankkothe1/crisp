import React, { useState, useEffect } from "react";

import { Modal } from "react-bootstrap";
import PostTile from "../Post/PostTile";
import PostModal from "../Post/PostModal";

import { makeStyles } from "@material-ui/core";

import Pagination from "@material-ui/lab/Pagination";

import recipeCollectionService from "../../services/RecipeCollectionService";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    post: {
        overflowY: "scroll",
        padding: "25px 25px 0",
        columnCount: 2,
        gridColumnGap: "1em",
        columnGap: "1em",
        width: "90%",
    },
    nof: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignContent: "center",
        top: "50%",
        left: "50%",
    },
}));

export default function ShopItemsList(props) {
    const classes = useStyles();

    const {
        dataChanged,
        setDataChanged,
        recipeType,
        meal,
        minPrice,
        maxPrice,
        buttonClicked,
        limit,
    } = props;

    const [rcd, setRCD] = useState([]);

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState();

    const [anyChange, setAnyChange] = useState(false);

    useEffect(async () => {
        const res = await recipeCollectionService.getRecipeCollections(
            limit,
            page,
            recipeType,
            meal,
            minPrice,
            maxPrice
        );

        if (res.status == 200) {
            setRCD(res.data.docs);
            setPageCount(res.data.totalPages);
        }
    }, [anyChange]);

    useEffect(() => {
        setPage(1);
        setAnyChange(!anyChange);
    }, [recipeType, buttonClicked, dataChanged]);

    useEffect(() => {
        setPage(page);
        setAnyChange(!anyChange);
    }, [page]);

    const [show, setShow] = useState(false);
    const [rcIndex, setRCIndex] = useState(0);

    const handleClose = () => setShow(false);

    const displayRC = (i) => {
        setRCIndex(i);
        setShow(true);
    };

    return rcd?.length > 0 ? (
        <div className={classes.root}>
            <div className={classes.post}>
                {rcd.map((rc, i) => {
                    const rcProps = {
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
                        data={rcd[rcIndex]}
                        dataChanged={dataChanged}
                        setDataChanged={setDataChanged}
                        postType="RecipeCollection"
                    />
                </Modal>
            </div>
            <Pagination
                count={pageCount}
                onChange={(event, value) => {
                    setPage(value);
                }}
                showFirstButton
                showLastButton
            />
        </div>
    ) : (
        <div className={classes.nof}>
            <h1> No posts found! </h1>
        </div>
    );
}
