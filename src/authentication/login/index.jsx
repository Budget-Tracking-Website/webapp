import React, { useState } from "react";
import "./login.css";
import mail from "../../assets/logos/mail.svg";
import { useNavigate } from "react-router-dom";
import Authentication from "../../firebaseAPI/authentication";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address"
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", formData);
            return navigate("/maintenance");
        }
        else {
            console.log("Form validation failed");
        }
    }

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };

    const handleSignInWithGoogle = async () => {
        const auth = new Authentication();
        try {
            auth.signInWithGoogle()
                .then(user => {
                    // console.log("User Email:", auth.getUserEmail());
                    // console.log("User Name:", auth.getUserName());
                    navigate("/dashboard");
                })
                .catch(error => {
                    // console.error("Sign-In Error:", error);
                    toast.error("Sign-In Error: "+error, {
                        position: "top-center",
                        theme: "colored"
                    })
                });
        } catch (error) {
            // console.error("Error signing in with Google:", error);
            toast.error("Error signing in with Google: "+error, {
                position: "top-center",
                theme: "colored"
            })
        }
    };

    return (
        <div className="login">
            <div className="heading" style={{ paddingBottom: '1vmax' }}>
                Adv. Sunil A. Humbre
            </div>
            <div className="heading2" style={{ paddingBottom: '1vmax' }}>
                Login
            </div>
            <form className="window" onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={mail} alt="mail-icon" className="logo" />
                    &nbsp;
                    Email address
                </div>
                {/* <input type="text" name="email" className="input" value={formData.email} onChange={handleChange} required />
                {errors.email && <div className="error">{errors.email}</div>}
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="primary-button" type="submit">
                        Sign in
                    </button>
                </div> */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                    <button className="primary-button" onClick={handleSignInWithGoogle}>
                        Sign in with Google
                    </button>
                </div>
            </form>
            <p className="description">
                <b>Warning:</b> For Internal Use Only. Unauthorized access strictly prohibited.
            </p>
            <div className="description">
                For queries contact us at <b><i>sunilhumbre@gmail.com</i></b>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login;