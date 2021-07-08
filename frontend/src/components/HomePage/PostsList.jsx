/* eslint-disable react/prop-types */
import React from "react";
import StarRatings from "react-star-ratings";
import ReactPlayer from "react-player";
import "./PostList.css";

export default function PostsList(props) {
    const postData = props["data"];
    return (
        <div className="post-list-container">
            <div className="post">
                {postData.map((post, i) => (
                    <div key={i} className="post-container">
                        <div className="post-container-header">
                            <h5>{post["title"]}</h5>
                            <StarRatings
                                starRatedColor="black"
                                rating={parseInt(post["rating"]) / 2}
                                starDimension="20px"
                                starSpacing="15px"
                            />
                        </div>
                        <div className="media-container">
                            <div className="post-container-media">
                                {post["media"].length &&
                                    post["media"].map((media) =>
                                        media["type"] === "image" ? (
                                            <div className="post-media">
                                                <img src={media["URL"]} />
                                            </div>
                                        ) : (
                                            <div className="post-media">
                                                <ReactPlayer
                                                    playing={true}
                                                    light={true}
                                                    width={500}
                                                    height={500}
                                                    controls={true}
                                                    url={media["URL"]}
                                                />
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>
                        <div className="details-container">
                            <p className="description-container">
                                <strong>{`${post["postedBy"]} `}</strong>
                                {post["description"]}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
