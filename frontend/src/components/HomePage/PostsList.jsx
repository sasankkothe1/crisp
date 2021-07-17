/* eslint-disable react/prop-types */
import React from "react";
import "./PostList.css";
import PostTile from "../Post/PostTile";

export default function PostsList(props) {
    const postData = props["data"];
    return (
        <div className="post">
            {postData.map((post, i) => (
                <PostTile key={i} data={post} />
            ))}
        </div>
    );
}
