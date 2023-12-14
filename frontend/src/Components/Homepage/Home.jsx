import React from "react";
import { Link } from "react-router-dom";
import './Home.css';
import TabbedPanel from "../PageComponent/TabbedPanel";

export default function Home() {
    return (
        <>
            <header className="head-container">
                <div className="header-left">
                    <Link to="/" style={{textDecoration:"none"}}>
                        <span className="title">mukiIO</span>
                    </Link>
                </div>
                <div className="header-right">
                    <span className="text">LogIn</span>
                    <span className="text">SignIn</span>
                </div>
            </header>
            <div className="main-container">
                <div className="main-left">
                    
                </div>
                <div className="main-center">
                    <TabbedPanel />
                </div>
                <div className="main-right">
                    
                </div>
            </div>
        </>
    )
}