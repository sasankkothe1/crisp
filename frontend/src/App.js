import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header";
//import Header2 from "./components/Header2/Header2";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header />
            </div>
        </BrowserRouter>
    );
}

export default App;
