/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Pagination from "@material-ui/lab/Pagination";
import "./PostList.css";
import PostTile from "../Post/PostTile";
import PostModal from "../Post/PostModal";

export default function PostsList(props) {
    const [show, setShow] = useState(false);
    const [postIndex, setPostIndex] = useState(0);

    const handleClose = () => setShow(false);

    const { limit, fetchMethod, fetchParam, editable } = props;

    const [data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState([{}]);

    useEffect(() => {
        fetchPage(1);
    }, []);

    useEffect(() => {
        fetchPage(1);
    }, [fetchMethod, fetchParam]);

    const fetchPage = (page) => {
        fetchMethod(limit, page, fetchParam).then((res) => {
            setData(res.docs);
            setPaginationData({ totalPages: res.totalPages });
        });
    };

    const displayPost = (i) => {
        setPostIndex(i);
        setShow(true);
    };

    const handlePaginationChange = (_event, value) => {
        fetchPage(value);
    };

    const [dataChanged, setDataChanged] = useState(false);

    return data?.length > 0 ? (
        <div className="root">
            <div className="post">
                {data.map((post, i) => (
                    <PostTile
                        onClick={() => displayPost(i)}
                        key={i}
                        data={post}
                    />
                ))}
                <Modal
                    size={"lg"}
                    scrollable
                    centered
                    show={show}
                    onHide={handleClose}
                >
                    <PostModal data={data[postIndex]} editable={editable} dataChanged={dataChanged} setDataChanged={setDataChanged} />
                </Modal>
            </div>
            <Pagination
                count={paginationData.totalPages}
                onChange={handlePaginationChange}
                showFirstButton
                showLastButton
            />
        </div>
    ) : (
        <h1>Loading</h1>
    );
}
