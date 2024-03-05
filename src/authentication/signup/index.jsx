import React, { useState } from "react";
import "../login/login.css";
import { useNavigate } from "react-router-dom";
import Authentication from "../../firebaseAPI/authentication";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../components/loading";

function Signup() {

    let navigate = useNavigate();
    let auth = new Authentication();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isloading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", formData);
            auth.createUser(formData.email, formData.password).then(() => {
                return navigate("/");
            }).catch((e) => {
                toast.error(e);
            })
        }
        else {
            console.log("Form validation failed");
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
                    &nbsp;
                    Name
                </div>
                <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    &nbsp;
                    Email address
                </div>
                <input type="text" name="email" className="input" value={formData.email} onChange={handleChange} required />
                {errors.email && <div className="error">{errors.email}</div>}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    &nbsp;
                    Password
                </div>
                <input type="password" name="password" className="input" value={formData.password} onChange={handleChange} required />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    &nbsp;
                    Confirm Password
                </div>
                <input type="password" name="confirmPassword" className="input" value={formData.confirmPassword} onChange={handleChange} required />
                {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="primary-button" type="submit">
                        Create account
                    </button>
                </div>
            </form>
            <p className="description">
                Already have an account? <Link to="/">Login here</Link>
            </p>
            {isloading && <Loading message={"creating your account"} />}
            <ToastContainer />
        </div>
    )
}

export default Signup;
