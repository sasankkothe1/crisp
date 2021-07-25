/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StarRatings from "react-star-ratings";
import ReactPlayer from "react-player";
import moment from "moment-timezone";
import { Button } from "@material-ui/core/";
import EditIcon from "@material-ui/icons/Edit";

import PaymentPortal from "../../components/Payment/PaymentPortal";

import "./PostModal.css";

import RecipeCollectionService from "../../services/RecipeCollectionService";
import RatingService from "../../services/RatingService";

import SnackbarAlert from "../Alert/SnackbarAlert";

import { isLoggedIn } from "../../services/utils";

import UserRating from "../Rating/Rating";

export default function PostModal({
    data,
    dataChanged,
    setDataChanged,
    postType,
    editable,
}) {
    const [showPaymentPortal, setShowPaymentPortal] = useState(false);

    const [paymentAttempt, setPaymentAttempt] = useState(false);
    const [paymentResponse, setPaymentResponse] = useState();

    return (
        <div>
            <Modal.Header className="post-modal-header" closeButton>
                <div className={"post-modal-header-left"}>
                    {data["title"] && (
                        <Modal.Title>{data["title"]}</Modal.Title>
                    )}
                    {postType == "RecipeCollection" &&
                        isLoggedIn() &&
                        (data.purchased && data.purchased == true ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                    const res =
                                        await RecipeCollectionService.getRecipeCollectionLink(
                                            data._id
                                        );
                                    if (res.status == 200) {
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
                            <>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={async () => {
                                        setShowPaymentPortal(true);
                                    }}
                                >
                                    {`Checkout ${data.price}€`}
                                </Button>

                                <PaymentPortal
                                    orderType="RecipeCollection"
                                    orderObject={data}
                                    show={showPaymentPortal}
                                    setShow={setShowPaymentPortal}
                                    onSuccess={(res) => {
                                        setPaymentResponse(res.data);
                                        setPaymentAttempt(true);
                                    }}
                                    onFailure={(res) => {
                                        console.log(res);
                                    }}
                                />
                                {paymentResponse && (
                                    <SnackbarAlert
                                        open={paymentAttempt}
                                        success={paymentResponse.success}
                                        onClose={() => {
                                            setPaymentResponse(null);
                                            setPaymentAttempt(false);
                                            setDataChanged(!dataChanged);
                                        }}
                                        onSuccess={() =>
                                            `Successful payment: ${paymentResponse.order._id}`
                                        }
                                        onError={() =>
                                            `Error: ${paymentResponse.data.error}`
                                        }
                                    />
                                )}
                            </>
                        ))}
                    {data._id ? (
                        <UserRating
                            entryID={data._id}
                            dataChanged={dataChanged}
                            setDataChanged={setDataChanged}
                            rateEntry={async (id, rate) => {
                                if (postType == "RecipeCollection") {
                                    const res =
                                        await RecipeCollectionService.rateRecipeCollection(
                                            id,
                                            rate
                                        );
                                    return res.status == 200;
                                }
                                return true;
                            }}
                            getEntryUserRate={async (id) => {
                                if (postType == "RecipeCollection") {
                                    const res = await RatingService.getUserRate(
                                        id,
                                        postType
                                    );

                                    return [
                                        res.status == 200,
                                        res.data.rating / 2,
                                    ];
                                }
                                return [true, 3.775];
                            }}
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
                                    {editable && (
                                        <div className="post-modal-edit-button">
                                            <Link
                                                to={`/edit${data["typeOfPost"]}/${data["_id"]}`}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="default"
                                                    startIcon={<EditIcon />}
                                                >
                                                    Edit
                                                </Button>
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

                                {editable && (
                                    <div className="post-modal-edit-button">
                                        <Link
                                            to={`/edit${data["typeOfPost"]}/${data["_id"]}`}
                                        >
                                            <Button
                                                variant="contained"
                                                color="default"
                                                startIcon={<EditIcon />}
                                            >
                                                Edit
                                            </Button>
                                        </Link>
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
