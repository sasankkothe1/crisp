import React from "react";
import Banner from "../components/Banner/Banner";
import PostsList from "../components/HomePage/PostsList";
import SideBar from "../components/HomePage/SideBar";

import "./HomeView.css";

export default function HomeView() {
    return (
        <div>
            <Banner />
            <div className="homeView-container">
                <PostsList />
                <SideBar />
            </div>
        </div>
    );
}
