/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StarRatings from "react-star-ratings";
import ReactPlayer from "react-player";
import moment from "moment-timezone";

import Button from "@material-ui/core/Button";

import "./PostModal.css";
import { Link } from "react-router-dom";

import RecipeCollectionService from "../../services/RecipeCollectionService";

export default function PostModal({ data, rcProps }) {
    return (
        <div>
            <Modal.Header className="post-modal-header" closeButton>
                <div className={"post-modal-header-left"}>
                    {data["title"] && (
                        <Modal.Title>{data["title"]}</Modal.Title>
                    )}
                    {rcProps &&
                        (data.purchased && data.purchased == true ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                    console.log(data._id);
                                    const res =
                                        await RecipeCollectionService.getRecipeCollectionLink(
                                            data._id
                                        );
                                    if (res.status == 200) {
                                        console.log(res.data.link);
                                        const newWindow = window.open(
                                            res.data.link,
                                            "_blank",
                                            "noopener,noreferrer"
                                        );
                                        if (newWindow) newWindow.opener = null;
                                    }
                                }}
                            >
                                Open PDF
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={async () => {
                                    console.log(data._id);
                                    const res = await RecipeCollectionService.checkoutRecipeCollectionMock(
                                        data._id
                                    ); 
                                    if (res.status == 201 && res.data.id) {
                                        console.log("Success!");
                                        rcProps.setPurchaseMade(!rcProps.purchaseMade);
                                        //setPurchased(true);
                                    } else {
                                        console.log("Error :(");
                                    }
                                }}
                            >
                                {`Checkout ${data.price}€`}
                            </Button>
                        ))}
                    {data["rating"] !== 0 ? (
                        <StarRatings
                            className={"post-modal-ratings"}
                            starRatedColor="black"
                            rating={parseInt(data["rating"]) / 2}
                            starDimension="20px"
                            starSpacing="2px"
                        />
                    ) : (
                        <StarRatings
                            className={"post-modal-ratings"}
                            starRatedColor="black"
                            rating={0}
                            starDimension="20px"
                            starSpacing="2px"
                        />
                    )}
                </div>
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
                                </Col>
                                <Col xs={6} md={4}>
                                    <div className="post-modal-content-description">
                                        <p>
                                            <strong>{`${data["postedBy"]["firstName"]}`}</strong>{" "}
                                            {data["description"]}
                                        </p>
                                    </div>
                                    {data["typeOfPost"] === "event" && (
                                        <div className="post-modal-event-details">
                                            <div>
                                                <strong>Held on: </strong>
                                                {moment(data["eventDate"])
                                                    .tz("Europe/Berlin")
                                                    .format("DD.MM.YYYY")}
                                            </div>

                                            <div>
                                                <strong>Starts at: </strong>
                                                {moment(data["startTime"])
                                                    .tz("Europe/Berlin")
                                                    .format("HH:mm")}
                                            </div>

                                            <div>
                                                <strong>Ends by: </strong>
                                                {moment(data["endTime"])
                                                    .tz("Europe/Berlin")
                                                    .format("HH:mm")}
                                            </div>
                                            <div>
                                                <strong>Location: </strong>
                                                <a href={data["eventLocation"]}>
                                                    {data["eventLocation"]}
                                                </a>
                                            </div>
                                        </div>
                                    )}
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
                                    {data["typeOfPost"] === "recipe" && (
                                        <div className="post-modal-full-recipe-link">
                                            <Link
                                                className="full-recipe-link"
                                                to={`/viewRecipe/${data["_id"]}`}
                                            >
                                                Click here to view the full
                                                recipe
                                            </Link>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Container>
                    ) : (
                        <Container>
                            <Row>
                                <div className="post-modal-content-description">
                                    <p>
                                        <strong>{`${data["postedBy"]["firstName"]}`}</strong>{" "}
                                        {data["description"]}
                                    </p>
                                </div>
                                {data["typeOfPost"] === "event" && (
                                    <div className="post-modal-event-details">
                                        <div>
                                            <strong>Held on: </strong>
                                            {moment(data["eventDate"])
                                                .tz("Europe/Berlin")
                                                .format("DD.MM.YYYY")}
                                        </div>

                                        <div>
                                            <strong>Starts at: </strong>
                                            {moment(data["startTime"])
                                                .tz("Europe/Berlin")
                                                .format("HH:mm")}
                                        </div>

                                        <div>
                                            <strong>Ends by: </strong>
                                            {moment(data["endTime"])
                                                .tz("Europe/Berlin")
                                                .format("HH:mm")}
                                        </div>
                                        <div>
                                            <strong>Location: </strong>
                                            <a href={data["eventLocation"]}>
                                                {data["eventLocation"]}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </Row>
                        </Container>
                    )}
                </div>
            </Modal.Body>
        </div>
    );
}
