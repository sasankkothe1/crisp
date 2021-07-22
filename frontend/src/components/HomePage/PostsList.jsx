/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./PostList.css";
import PostTile from "../Post/PostTile";
import PostModal from "../Post/PostModal";

export default function PostsList(props) {
    const [show, setShow] = useState(false);
    const [postIndex, setPostIndex] = useState(0);

    const handleClose = () => setShow(false);

    const postData = props["data"];

    const displayPost = (i) => {
        setPostIndex(i);
        setShow(true);
    };

    return (
        <div className="post">
            {postData.map((post, i) => (
                <PostTile onClick={() => displayPost(i)} key={i} data={post} />
            ))}
            <Modal
                size={"lg"}
                scrollable
                centered
                show={show}
                onHide={handleClose}
            >
                <PostModal data={postData[postIndex]} />
            </Modal>
        </div>
    );
}
