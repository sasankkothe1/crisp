/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import PersonIcon from "@material-ui/icons/Person";
import ReactPlayer from "react-player";

import DoneAllIcon from "@material-ui/icons/DoneAll";
import LocalOffer from "@material-ui/icons/LocalOffer";
import EuroIcon from "@material-ui/icons/Euro";

import Rating from "@material-ui/lab/Rating";

import "./PostTile.css";

import { getLoggedInUserID } from "../../services/utils";

const PostTile = ({ data, onClick, isRC }) => {
    const { media } = data;

    return (
        <div className="post-tile-container" onClick={onClick}>
            <div
                className={
                    isRC && data.purchased && data.purchased === true
                        ? "rc-tile-header"
                        : "post-tile-header"
                }
            >
                <div className="post-tile-header-left">
                    <PersonIcon fontSize="small" ml="2rem" />
                    <div>
                        <h6 className="post-tile-header-user">
                            {!isRC
                                ? data["postedBy"]["firstName"]
                                : data.postedBy._id !== getLoggedInUserID()
                                ? data["postedBy"]["firstName"]
                                : `${data["postedBy"]["firstName"]} (me)`}
                        </h6>
                    </div>
                    {isRC &&
                        data.price &&
                        data.purchased &&
                        data.purchased === true && (
                            <DoneAllIcon fontSize="small" />
                        )}
                    {isRC && data.price && !data.purchased && (
                        <React.Fragment>
                            <LocalOffer fontSize="small" />
                            <div>
                                <h6 className="post-tile-header-user">
                                    {data.price}
                                </h6>
                            </div>
                            <EuroIcon fontSize="small" />
                        </React.Fragment>
                    )}
                </div>
                <div className="post-tile-header-right">
                    <Rating
                        className={"post-tile-ratings"}
                        name="simple-controlled"
                        value={data.rating / 2}
                        precision={0.1}
                        readOnly
                    />
                </div>
            </div>
            <div className="post-tile-content">
                {media.length ? (
                    <Carousel showThumbs={false} showArrows={true}>
                        {data["media"].map((el) =>
                            el.split(".")[el.split(".").length] !== "mp4" ? (
                                <div className="post-tile-content-image">
                                    <img src={el} />
                                </div>
                            ) : (
                                <div className="post-tile-content-video">
                                    <ReactPlayer
                                        className="react-player"
                                        playing={true}
                                        light={true}
                                        controls={true}
                                        height="100%"
                                        width="100%"
                                        url={el}
                                    />
                                </div>
                            )
                        )}
                    </Carousel>
                ) : (
                    <h6>{data["title"]}</h6>
                )}
            </div>
        </div>
    );
};

PostTile.PropTypes = {
    isRC: PropTypes.bool,
    data: PropTypes.array,
    onClick: PropTypes.func,
};

export default PostTile;
