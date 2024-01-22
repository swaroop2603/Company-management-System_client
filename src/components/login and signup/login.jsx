import React, { useState } from "react";
import styles from './login.css' 
import user_icon from '../assests/person.png';
import email_icon from '../assests/email.png';
import password_icon from '../assests/password.png';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import BASE_URL from "../../config";

const LoginSignup = () => {
    const navigate = useNavigate();
    const [userData,setuserData]=useState([])

    const handleLogin = async () => {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const data = {
            password: password,
            email: email
        };

        try {
            const response = await axios({
                method: 'post',
                url: `${BASE_URL}/CMS/login`,
                data: data
            });
            console.log("data fpor login",response)
           
           
            navigate('/home', { state: { user: response.data } });
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreateCompany = () => {
        navigate('./create-company');
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">Signin</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" id="email" placeholder="Email id" required />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" id="password" placeholder="password" required />
                </div>
                <div className="forgot-password">Lost password?<span>click here!</span></div>
                <div className="create-company" onClick={handleCreateCompany}>
                    create-company<span> click here!</span>
                </div>
                <div className="submit-conatiner">
                    <div className="submit" onClick={handleLogin}>sign in</div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;