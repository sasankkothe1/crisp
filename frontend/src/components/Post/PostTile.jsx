/* eslint-disable react/prop-types */
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import PersonIcon from "@material-ui/icons/Person";
import StarRatings from "react-star-ratings";
import ReactPlayer from "react-player";

import "./PostTile.css";

export default function PostTile(props) {
    const { data, onClick } = props;
    const { media } = data;

    return (
        <div className="post-tile-container" onClick={onClick}>
            <div className="post-tile-header">
                <div className="post-tile-header-left">
                    <PersonIcon fontSize="small" ml="2rem" />
                    <div>
                        <h6 className="post-tile-header-user">
                            {data["postedBy"]["firstName"]}
                        </h6>
                    </div>
                </div>
                <div className="post-tile-header-right">
                    <StarRatings
                        className={"post-tile-ratings"}
                        starRatedColor="black"
                        rating={parseInt(data["rating"]) / 2}
                        starDimension="20px"
                        starSpacing="2px"
                    />
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
