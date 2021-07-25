import React from "react";
import { useParams } from "react-router-dom";
import AddEventView from "../Event/AddEventView";

//TODO: see the EditPost.jsx and understand the implementation

export default function EditEvent() {
    let { id } = useParams();
    return (
        <div>
            <AddEventView eventID={id} editable={true} />
        </div>
    );
}
