/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React from "react";
import {Col, Container, Modal, Row} from "react-bootstrap";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StarRatings from "react-star-ratings";
import ReactPlayer from "react-player";
import moment from "moment-timezone";

import "./PostModal.css";

export default function PostModal({data}) {
    return (
        <div>
            <Modal.Header className="post-modal-header" closeButton>
                <div className={"post-modal-header-left"}>{data["title"] && <Modal.Title>{data["title"]}</Modal.Title>}
                    {data["rating"] !== 0 ? (
                        <StarRatings className={"post-modal-ratings"}
                                     starRatedColor="black"
                                     rating={parseInt(data["rating"]) / 2}
                                     starDimension="20px"
                                     starSpacing="2px"
                        />
                    ) : (
                        <StarRatings className={"post-modal-ratings"}
                                     starRatedColor="black"
                                     rating={0}
                                     starDimension="20px"
                                     starSpacing="2px"
                        />
                    )}</div>

            </Modal.Header>
            <Modal.Body>
                <div className="show-grid">
                    {data["media"].length ? (
                        <Container>
                            <Row>
                                <Col xs={12} md={8}>
                                    <div className="post-modal-media">
                                        {data["media"].length && (
                                            <Carousel
                                                showThumbs={false}
                                                showArrows={true}
                                            >
                                                {data["media"].map((el) =>
                                                    el.split(".")[
                                                        el.split(".").length
                                                        ] !== "mp4" ? (
                                                        <div>
                                                            <img className={"carousel-image"} src={el} spacing={0}/>
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
                                </Col>
                                <Col xs={6} md={4}>
                                    <div className="post-modal-content-description">
                                        <p>
                                            <strong>{`${data["postedBy"]}`}</strong>{" "}
                                            {data["description"]}
                                        </p>
                                    </div>
                                    <div className="post-modal-content-date-container">
                                        <h6 className="post-modal-content-date">
                                            <strong>Posted on </strong>
                                            {moment(data["datePosted"])
                                                .tz("Europe/Berlin")
                                                .format(
                                                    "MMMM Do YYYY, h:mm:ss a"
                                                )}
                                        </h6>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    ) : (
                        <Container>
                            <Row>
                                <div className="post-modal-content-description">
                                    <p>
                                        <strong>{`${data["postedBy"]}`}</strong>{" "}
                                        {data["description"]}
                                    </p>
                                </div>
                            </Row>
                        </Container>
                    )}
                </div>
            </Modal.Body>
        </div>
    );
}
