import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookieBite } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
// import { eventData } from "../../SampleData/postData";
import "./SideBarEvents.css";
import EventService from "../../services/EventService";
import PostModal from "../Post/PostModal";

export default function SideBarEvents() {
    const [events, setEvents] = useState([]);
    const [show, setShow] = useState(false);
    const [postIndex, setPostIndex] = useState(0);

    const handleClose = () => setShow(false);

    useEffect(() => {
        EventService.sideBarEvents().then((res) => {
            setEvents(res);
        });

        // events.map((el) => {
        //     console.log({
        //         title: el["title"],
        //         start: moment(el["startTime"])
        //             .tz("Europe/Berlin")
        //             .format("HH:mm"),
        //         end: moment(el["endTime"]).tz("Europe/Berlin").format("HH:mm"),
        //     });
        // });
    }, []);

    const displayPost = (i) => {
        setPostIndex(i);
        setShow(true);
    };

    return (
        <div className="sidebar-events-container">
            <h5 className="eventList-header">Upcoming Events</h5>
            <div className="eventList">
                {events.length &&
                    events.map((e, i) => (
                        <div
                            className="eventList-element"
                            key={i}
                            onClick={() => displayPost(i)}
                        >
                            <FontAwesomeIcon icon={faCookieBite} />
                            <h6 className="event-title">
                                {moment(e["eventDate"])
                                    .tz("Europe/Berlin")
                                    .format("DD.MM.YYYY")}
                            </h6>
                            <h6 className="event-title">{e["title"]}</h6>
                        </div>
                    ))}
            </div>
            <Modal
                size={"lg"}
                scrollable
                centered
                show={show}
                onHide={handleClose}
            >
                <PostModal data={events[postIndex]} />
            </Modal>
        </div>
    );
}
