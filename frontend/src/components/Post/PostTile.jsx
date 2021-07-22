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

    console.log(data);

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
                        starRatedColor="black"
                        rating={parseInt(data["rating"]) / 2}
                        starDimension="20px"
                        starSpacing="2px"
                    />
                </div>
            </div>
            <div className="post-tile-content">
                {media.length && (
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
                )}
            </div>
        </div>
    );
}

// <div key={i} className="post-container">
//     <div className="post-container-header">
//         <h5>{post["title"]}</h5>
//         <StarRatings
//             starRatedColor="black"
//             rating={parseInt(post["rating"]) / 2}
//             starDimension="20px"
//             starSpacing="15px"
//         />
//     </div>
//     <div className="media-container">
//         <div className="post-container-media">
//             {post["media"].length &&
//                 post["media"].map((media) =>
//                     media["type"] === "image" ? (
//                         <div className="post-media">
//                             <img src={media["URL"]} />
//                         </div>
//                     ) : (
//                         <div className="post-media">
//                             <ReactPlayer
//                                 playing={true}
//                                 light={true}
//                                 width={500}
//                                 height={500}
//                                 controls={true}
//                                 url={media["URL"]}
//                             />
//                         </div>
//                     )
//                 )}
//         </div>
//     </div>
//     <div className="details-container">
//         <p className="description-container">
//             <strong>{`${post["postedBy"]} `}</strong>
//             {post["description"]}
//         </p>
//     </div>
// </div>
