import React from 'react';
import Profile from '../../assets/logos/profile.svg'
import Add from '../../assets/logos/add.svg'
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom for navigation

function Header({ title }) {

    const handleProfileClick = () => {
        console.log("Profile photo clicked. Navigating to profile page...");
    };
    const handleProfileClick1 = () => {
        return navigate('/expense');
    };
    
    let navigate = useNavigate();

    return (
        <header style={headerStyle}>
            <h2>{title}</h2>
            {/* Profile photo with onClick event handler */}
            <div style={{flexGrow:'1'}}></div>
            <img src={Add} alt="Add" style={profileStyle1} onClick={handleProfileClick1} />
            <img src={Profile} alt="Profile" style={profileStyle} onClick={handleProfileClick} />
        </header>
    );
};

// Inline styles for header and profile photo
const headerStyle = {
    background: '#f3f3f3',
    color: '#000',
    textAlign: 'center',
    padding: '10px',
    display: 'flex',
    height: '5vh',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligns items to the start and end of the header
};

const profileStyle = {
    height: '90%',
    width: '7vh',
    borderRadius: '50%', // Makes the image circular
    cursor: 'pointer', // Change cursor to pointer on hover
    position: 'relative'
};
const profileStyle1 = {
    height: '80%',
    width: '7vh',
    borderRadius: '50%', // Makes the image circular
    cursor: 'pointer', // Change cursor to pointer on hover
    position: 'relative'
};

export default Header;
