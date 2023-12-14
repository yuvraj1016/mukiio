import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import plus from "../Image/plus.svg";
import axios from "axios";
import Cookies from 'js-cookie';


function Imageupload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    let fileRef = {};
    const selectFile = (e) => {
        const files = e.dataTransfer
            ? e.dataTransfer.files
            : e.target.files;
        setSelectedImage(files[0]);
    }
    const sendData = async () => {
        try {
            const userId = Cookies.get('UserID');
            const imageData = new FormData();
            imageData.append('image', selectedImage);
            imageData.append('user_Id',userId);
            const url = process.env.REACT_APP_BACKEND_URI + '/getUserImage';
            await axios.post(url, imageData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('ID created succefully login using your credentials');
            Cookies.remove('UserID');
            navigate('/');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        }
    }

    return (
        <>
            <header className="head-container">
                <div className="header-left">
                    <Link to="/" style={{ textDecoration: "none" }}>
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
                    <div className='imageLoader'>
                        <h1>Upload Your Display Picture</h1>
                        <div className='image-container'>
                            <input
                                type='file' accept='image/*'
                                ref={(input) => fileRef[0] = input}
                                onChange={(e) => selectFile(e)}
                            />
                            {!selectedImage ?
                                <div className='imageLoader'>
                                    <img
                                        style={{ height: "80px", width: "80px" }}
                                        onClick={() =>
                                            this.fileRef[0].click()
                                        }
                                        src={plus}
                                        alt="default"
                                    />
                                    <p
                                        style={{ marginTop: "10px", fontSize: "15px", color: "#" }}
                                        onClick={() =>
                                            this.fileRef[0].click()
                                        }
                                    >
                                        Upload Image
                                    </p>
                                </div> : <img src={URL.createObjectURL(selectedImage)} />
                            }
                        </div>
                        <button
                            onClick={sendData}
                            value='Done'
                            style=
                            {{
                                marginTop: "4vh",
                                backgroundColor: "#474647",
                                border: 'none',
                                boxShadow: "2vh 2vh 4vh #82FF9E",
                                padding: "2vh"
                            }}
                            disabled={!selectedImage}
                        >
                            Done</button>
                    </div>
                </div>
                <div className="main-right">

                </div>
            </div>
        </>

    )
}

export default Imageupload;
