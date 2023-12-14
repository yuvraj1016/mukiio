import { Link, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import plus from "../Image/plus.svg";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

export default function User() {
    let fileRef = {};
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [audioName, setAudioName] = useState(null);
    const [songs, setSongs] = useState({})
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [played, setPlayed] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef(null);
    const [picture, setPicture] = useState({});
    const FirstName = Cookies.get('FirstName');
    const LastName = Cookies.get('LastName');
    const [visibleSongs, setVisibleSongs] = useState(8);


    const handleSeek = (e) => {
        console.log('Seek Event:', e);
        if (e && e.target && e.target.currentTime !== undefined) {
            const newTime = e.target.currentTime;
            setPlayed(newTime);
        }
    };

    const logOut = () => {
        Cookies.remove('FirstName');
        Cookies.remove('LastName');
        Cookies.remove('UserID');
        navigate('/');
    }
    const handleNext = () => {
        const nextIndex = (currentSongIndex + 1) % songs.musicFiles.length;
        setCurrentSongIndex(nextIndex);
        setPlayed(0);
    };

    const handlePrevious = () => {
        const previousIndex = (currentSongIndex - 1 + songs.musicFiles.length) % songs.musicFiles.length;
        setCurrentSongIndex(previousIndex);
        setPlayed(0);
    };

    const handleEnded = () => {
        handleNext();
    };

    const handleSongClick = (index) => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
    };
    useEffect(
        () => {
            const getDetails = async () => {
                const user_id = Cookies.get('UserID');
                const body = {
                    userId: user_id
                };
                const url = process.env.REACT_APP_BACKEND_URI + '/getuserpicture';
                const response = await axios.post(url, body);
                console.log(response.data);
                setPicture(response.data);
            }
            getDetails();
        }, []);

    const sendMusicData = async (e) => {
        if (selectedFile) {
            const userId = Cookies.get('UserID');
            const audioData = new FormData();
            audioData.append('audio', selectedFile);
            audioData.append('user_Id', userId);
            const url = process.env.REACT_APP_BACKEND_URI + '/musicupload';
            await axios.post(url, audioData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File Uploaded Successfully');
            window.location.reload();
        }
    }
    const selectAudio = async (e) => {
        const files = e.dataTransfer
            ? e.dataTransfer.files
            : e.target.files;
        setSelectedFile(files[0]);
    }
    const searchData = async () => {
        const body = {
            FileName: audioName
        }
        const url = process.env.REACT_APP_BACKEND_URI + '/getmusic';
        await axios.post(url, body)
            .then((res) => {
                console.log(res.data)
                setSongs(res.data);
                setCurrentSongIndex(0);
            }
            ).catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = process.env.REACT_APP_BACKEND_URI + '/getallmusic';
                const response = await axios.post(url);
                setSongs(response.data);
                console.log(response.data);
                setCurrentSongIndex(0);
                console.log(currentSongIndex);
            } catch (error) {
                console.error('Error fetching music data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <header className="head-container">
                <div className="header-left">
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <span className="title">mukiIO</span>
                    </Link>
                </div>
                <div className="header-right">
                    <input type="search" placeholder="Search for Songs" value={audioName} onChange={(e) =>setAudioName(e.target.value)} />
                    <button onClick={searchData}>Search</button>
                </div>
            </header>
            <div className="main-container">
                <div className="main-left">
                    <div className='imageLoader'>
                        <h1>Create With Us</h1>
                        <div className='image-container'>
                            <input
                                type='file' accept='audio/*'
                                ref={(input) => fileRef[0] = input}
                                onChange={(e) => selectAudio(e)}
                            />
                            {!selectedFile ?
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
                                        Upload Audio
                                    </p>
                                </div> : <p style={{ marginTop: "10px", fontSize: "15px", color: "#" }}>click to add more</p>
                            }
                        </div>
                        <button
                            onClick={sendMusicData}
                            style=
                            {{
                                marginTop: "4vh",
                                backgroundColor: "#474647",
                                border: 'none',
                                boxShadow: "2vh 2vh 4vh #82FF9E",
                                padding: "2vh"
                            }}
                            disabled={!selectedFile}
                        >
                            Done</button>
                    </div>
                </div>
                <div className="main-center" style={{
                    display: "flex",
                    flexDirection: "column"
                }} >
                    <div style={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <h1>Welcome {FirstName} {LastName}</h1>
                        {picture.UserImage &&
                            <img
                                src={`data:${picture.UserImage.contentType};base64,${picture.UserImage.data}`}
                                alt="Dp"
                                style={{
                                    width: "20vh",
                                    border: "none",
                                    borderRadius: "10vh"
                                }}
                            />}
                    </div>
                    {songs.musicFiles &&
                        <>
                            <p>{songs.musicFiles[currentSongIndex].filename}</p>
                            <ReactPlayer
                                ref={playerRef}
                                url={`data:${songs.musicFiles[currentSongIndex].contentType};base64,${songs.musicFiles[currentSongIndex].data}`}
                                controls={true}
                                width="80%"
                                height="40px"
                                onSeek={handleSeek}
                                played={played}
                                onStart={() => setPlayed(0)}
                                onEnded={handleEnded}
                                playing={true}
                            />
                            <div>
                                <button onClick={handlePrevious}>Previous</button>
                                <button onClick={handleNext}>Next</button>
                            </div>
                        </>}

                </div>
                <div className="main-right">
                    <h1>Songs List</h1>
                    {
                        songs.musicFiles &&
                        <ul>
                            {songs.musicFiles.slice(0, visibleSongs).map((item, index) => (

                                <li className="list" key={item.filename} onClick={() => handleSongClick(index)} style={{
                                    margin: "2vh",
                                    borderRadius: "4vh",
                                    border: "none",
                                    boxShadow: "1vh 1vh 2vh #82FF9E",
                                    padding: "1vh",
                                    fontSize: "2vh",
                                    color: "#82FF9E"
                                }}>
                                    {item.filename}
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
            <div className="main-center" style={{ marginTop: "10vh" }}>
                <button onClick={logOut}>Log Out</button>
            </div>
        </>
    );
}