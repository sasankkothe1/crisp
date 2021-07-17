import React from "react";
import Banner from "../components/Banner/Banner";
import PostsList from "../components/HomePage/PostsList";
import SideBar from "../components/HomePage/SideBar";

import { postData } from "../SampleData/postData";

import "./HomeView.css";

export default function HomeView() {
    return (
        <div>
            <Banner />
            <div className="homeView-container">
                <div className="homeView-postList">
                    <PostsList data={postData} />
                </div>
                <div className="homeView-sideBar">
                    <SideBar />
                </div>
            </div>
        </div>
    );
}
