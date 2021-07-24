import React from "react";
import { useParams } from "react-router-dom";
import PostView from "../Post/PostView";

export default function EditPost() {
    let { id } = useParams();
    return (
        <div>
            <PostView postID={id} editable={true} />
        </div>
    );
}
