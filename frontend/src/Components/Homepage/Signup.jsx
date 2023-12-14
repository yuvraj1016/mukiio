import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signinandlogin.css";
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Signup() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [flagU, setFlagU] = useState(false);
    const [flagP, setFlagP] = useState(false);
    const [flagE, setFlagE] = useState(false);
    const [click, setClick] = useState(0)
    const handleSubmit = async (e) => {
        setClick(click + 1);
        e.preventDefault();
        await sendData();
        if (!flagU && !flagP && !flagE) {
            navigate('/image');
        }
    }
    const sendData = async () => {
        const Body = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Phone: phone,
            UserName: userName,
            PassWord: password
        }
        const url = process.env.REACT_APP_BACKEND_URI + '/getUserDetails';
        await axios.post(url, Body)
            .then((res) => {
                console.log(res.data);
                if (res.data.flagP !== 0) {
                    Cookies.set('UserID', res.data.userId, { expires: 2 });
                    setFlagP(false);
                } else if (res.data.flagU !== 0) {
                    Cookies.set('UserID', res.data.userId, { expires: 2 });
                    setFlagU(false);
                } else if (res.data.flagE !== 0) {
                    Cookies.set('UserID', res.data.userId, { expires: 2 });
                    setFlagE(false);
                } else {
                    setClick(0);
                }
            }).catch((err) => {
                console.error(err);
            })
    };

    return (
        <div className="signin-container">
            <form onSubmit={(e) => handleSubmit(e)} className="form-container">
                <input type="text" placeholder="First Name" required="required" maxLength={14} onChange={(e) => setFirstName(e.target.value)} value={firstName} />
                <input type="text" placeholder="Last Name" required="required" maxLength={14} onChange={(e) => setLastName(e.target.value)} value={lastName} />
                <input type="email" placeholder="Email" required="required" onChange={(e) => setEmail(e.target.value)} value={email} />
                <input type="tel" pattern="[0-9]{10}" placeholder="Mobile Number" required="required" minLength={10} maxLength={10} onChange={(e) => setPhone(e.target.value)} value={phone} />
                <input type="text" placeholder="UserName" required="required" minLength={8} maxLength={14} onChange={(e) => setUserName(e.target.value)} value={userName} />
                <input type="password" placeholder="Password" required="required" minLength={8} maxLength={14} onChange={(e) => setPassword(e.target.value)} value={password} />
                <input type="submit" value="SignUp" />
            </form>
            {
                (!flagU && click > 0) && <p style={{ color: 'red' }}>UserName Already Exists</p>
            }
            {
                (!flagP && click > 0) && <p style={{ color: 'red' }}>PhoneNumber Already Exists</p>
            }
            {
                (!flagE && click > 0) && <p style={{ color: 'red' }}>Email Already Exists</p>
            }
        </div>
    )
}