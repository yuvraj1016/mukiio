import React, { useState } from "react";
import './TabbedPanel.css';
import Login from "../Homepage/Login";
import Signup from "../Homepage/Signup";

export default function TabbedPanel() {
    const [openTab, setOpenTab] = useState(0);
    return (
        <div className="tab-container">
            <div className="tab-button-container">
                <button
                    className={openTab === 0 ? 'active' : 'tab-button'}
                    onClick={() => setOpenTab(0)
                    }>LogIn</button>
                <button
                    className={openTab === 1 ? 'active' : 'tab-button'}
                    onClick={() => setOpenTab(1)
                    }>SignIn</button>
            </div>
            <div className="tab-content">
                {openTab === 0 && <Login />}
                {openTab === 1 && <Signup />}
            </div>
        </div>
    )
}