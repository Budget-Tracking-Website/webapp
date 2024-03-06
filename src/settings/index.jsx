import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Leftpanel from '../components/panel/index.js';
import Header from '../components/header/index.jsx';
import ScrollToTop from '../components/ScrollToTop.js';
import Authentication from '../firebaseAPI/authentication.js';

import './settings.css';

function Account() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const auth = new Authentication();
    const navigate = useNavigate();

    useEffect(() => {
        auth.getAccess().then(() => {
            setEmail(auth.getUserEmail());
            setName(auth.getUserName());
        }).catch((e) => {
            console.error(e);
        });
    }, []);

    function signout() {
        auth.logout().then(() => {
            navigate('/');
        }).catch((e) => {
            console.error(e);
        })
    }

    function changepassword() {

    }

    return (
        <div className='dashboard'>
            <Header title={"My Account"} />
            <div className='main'>
                <Leftpanel />
                <div className='right-panel' style={{ background: 'white' }}>
                    <div>
                        <p>Name:    {name}</p>
                        <p>Email: {email}</p>
                        <button onClick={signout} style={{background:'red'}}>Sign Out</button><br></br>
                        {/* <button onClick={changepassword}>change password</button> */}
                    </div>
                </div>
            </div>
            <ScrollToTop />
        </div>
    );
}

export default Account;
