import React, { useState } from "react";
import "./login.css";
import mail from "../../assets/logos/mail.svg";
import password from "../../assets/logos/password.svg";
import { useNavigate } from "react-router-dom";
import Authentication from "../../firebaseAPI/authentication";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../components/loading";

function Login() {

    let navigate = useNavigate();
    let auth = new Authentication();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isloading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address"
        }

        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            console.log("Form submitted:", formData);
            auth.signInUser(formData.email, formData.password).then((result) => {
                if (result) {
                    return navigate("/dashboard");
                }
                else {
                    toast.error("Your email is not verified, verify your email using link sent on your email");
                }
            }).catch((e) => {
                toast.error(e);
            }).finally(() => {
                setLoading(false);
            })
        }
        else {
            console.log("Form validation failed");
        }
    }

    const handleForgotPassword = (e) => {
        e.preventDefault();
        if(formData.email.length>0){
            auth.sendPasswordResetEmail(formData.email).then(() => {
                toast.success("Password reset email sent!! change your password using it.");
            })
            .catch((e) => console.error(e));
        }
        else{
            toast.error("please enter your email to retreive password");
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="login">
            <form className="window" onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={mail} alt="mail-icon" className="logo" />
                    &nbsp;
                    Email address
                </div>
                <input type="text" name="email" className="input" value={formData.email} onChange={handleChange} required />
                {errors.email && <div className="error">{errors.email}</div>}
                <br />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={password} alt="mail-icon" className="logo" />
                    &nbsp;
                    Password
                </div>
                <input type="password" name="password" className="input" value={formData.password} onChange={handleChange} required />
                {errors.password && <div className="error">{errors.password}</div>}
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="primary-button" type="submit" style={{ backgroundColor: 'blue', width: '50%' }}>
                        Sign in
                    </button>
                    <button className="error-button" style={{ backgroundColor: 'red', width: '50%', fontSize: 'small' }} onClick={handleForgotPassword}>
                        Forgot Password
                    </button>
                </div>

            </form>
            <p className="description">
                Don't have an account? <Link to="/signup">Register here</Link>
            </p>
            {isloading && <Loading message={"signing you in"} />}
            <ToastContainer />
        </div>
    )
}

export default Login;
