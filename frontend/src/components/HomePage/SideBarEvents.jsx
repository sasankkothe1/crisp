import React from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookieBite } from "@fortawesome/free-solid-svg-icons";
import { eventData } from "../../SampleData/postData";
import "./SideBarEvents.css";

export default function SideBarEvents() {
    return (
        <div className="sidebar-events-container">
            <h5 className="eventList-header">Upcoming Events</h5>
            <div className="eventList">
                {eventData.length &&
                    eventData.map((e, i) => (
                        <div className="eventList-element" key={i}>
                            <FontAwesomeIcon icon={faCookieBite} />
                            <h6 className="event-title">
                                {moment(e["startDate"])
                                    .utc()
                                    .format("DD.MM.YYYY")}
                            </h6>
                            <h6 className="event-title">{e["title"]}</h6>
                        </div>
                    ))}
            </div>
        </div>
    );
}
