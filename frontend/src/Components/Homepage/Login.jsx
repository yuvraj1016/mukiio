import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './signinandlogin.css';
import axios from "axios";
import Cookies from 'js-cookie';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [flag, setFlag] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        await getUser();
        if (flag) {
            navigate('/user');
        }
    };
    function getUser() {
        const body = {
            USERNAME: username,
            PASSWORD: password
        }
        const url = process.env.REACT_APP_BACKEND_URI + '/getuser';
        axios.post(url, body)
            .then((res) => {
                console.log(res);
                setFlag(true);
                Cookies.set('FirstName', res.data.User.FirstName, { expires: 4 });
                Cookies.set('LastName', res.data.User.LastName, { expires: 4 })
                Cookies.set('UserID', res.data.User._id, { expires: 2 });
                console.log(Cookies.get('UserID'));
            }).catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="login-form-container">
            <form onSubmit={(e) => handleSubmit(e)} className="form-container">
                <input
                    type="text"
                    placeholder="UserName"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <input type="submit" value='LogIn' />
            </form>
            {
                flag && <p
                    style={{ color: 'red' }}
                >UserName or Password is Wrong</p>
            }
        </div>
    )
}