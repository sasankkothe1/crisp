import React from "react";

import { makeStyles } from "@material-ui/core";

import PersonIcon from "@material-ui/icons/Person";
import StarRatings from "react-star-ratings";

import EuroIcon from "@material-ui/icons/Euro";

const useStyles = makeStyles(() => ({
    shopItemContainer: {
        display: "flex",
        flexDirection: "column",
        margin: "1em",
    },
    shopItemHeader: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: "wheat",
    },
    shopItemHeaderLeft: {
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
    },
    shopItemHeaderRight: {
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
    },
    shopItemPrice: {
        flexDirection: "row",
        display: "flex",
        alignItems: "left",
    },
    shopItemContent: {},
}));

export default function ShopItem(props) {
    const classes = useStyles();

    const { data } = props;

    return (
        <div className={classes.shopItemContainer}>
            <div className={classes.shopItemHeader}>
                <div className={classes.shopItemHeaderLeft}>
                    <PersonIcon fontSize="small" />
                    <div>
                        <h6>{data["postedBy"]}</h6>
                    </div>
                </div>
                <div className={classes.shopItemHeaderRight}>
                    <div className={classes.shopItemPrice}>
                        <EuroIcon />
                        <div>
                            <h6>{data["price"]}</h6>
                        </div>
                    </div>
                    <div>
                        <StarRatings
                            starRatedColor="black"
                            rating={parseInt(data["rating"]) / 2}
                            starDimension="20px"
                            starSpacing="2px"
                        />
                    </div>
                </div>
            </div>
            <div className={classes.shopItemContent}>{data["description"]}</div>
        </div>
    );
}
