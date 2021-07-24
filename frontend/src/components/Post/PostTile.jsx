/* eslint-disable react/prop-types */
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import PersonIcon from "@material-ui/icons/Person";
import StarRatings from "react-star-ratings";
import ReactPlayer from "react-player";

import DoneAllIcon from "@material-ui/icons/DoneAll";
import LocalOffer from "@material-ui/icons/LocalOffer";
import EuroIcon from "@material-ui/icons/Euro";

import Rating from "@material-ui/lab/Rating";

import "./PostTile.css";

export default function PostTile(props) {
    const { data, onClick } = props;
    const { media } = data;

    const { rcProps } = props;

    return (
        <div className="post-tile-container" onClick={onClick}>
            <div
                className={
                    rcProps && rcProps.purchased && rcProps.purchased == true
                        ? "rc-tile-header"
                        : "post-tile-header"
                }
            >
                <div className="post-tile-header-left">
                    <PersonIcon fontSize="small" ml="2rem" />
                    <div>
                        <h6 className="post-tile-header-user">
                            {data["postedBy"]["firstName"]}
                        </h6>
                    </div>
                    {rcProps &&
                        rcProps.price &&
                        rcProps.purchased &&
                        rcProps.purchased === true && (
                            <DoneAllIcon fontSize="small" />
                        )}
                    {rcProps && rcProps.price && !rcProps.purchased && (
                        <React.Fragment>
                            <LocalOffer fontSize="small" />
                            <div>
                                <h6 className="post-tile-header-user">
                                    {rcProps.price}
                                </h6>
                            </div>
                            <EuroIcon fontSize="small" />
                        </React.Fragment>
                    )}
                </div>
                <div className="post-tile-header-right">
                    {rcProps ? (
                        <Rating
                            className={"post-tile-ratings"}
                            name="simple-controlled"
                            value={data.rating / 2}
                            precision={0.1}
                            readOnly
                        />
                    ) : (
                        <StarRatings
                            className={"post-tile-ratings"}
                            starRatedColor="black"
                            rating={parseInt(data["rating"]) / 2}
                            starDimension="20px"
                            starSpacing="2px"
                        />
                    )}
                </div>
            </div>
            <div className="post-tile-content">
                {media.length ? (
                    <Carousel showThumbs={false} showArrows={true}>
                        {data["media"].map((el) =>
                            el.split(".")[el.split(".").length] !== "mp4" ? (
                                <div>
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
}
