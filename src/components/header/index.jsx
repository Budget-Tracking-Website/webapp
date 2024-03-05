import React from 'react';
import Profile from '../../assets/logos/profile.svg'
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation

function Header({title}) {
    
    const handleProfileClick = () => {
        console.log("Profile photo clicked. Navigating to profile page...");
    };

    return (
        <header style={headerStyle}>
            <h3>{title}</h3>
            {/* Profile photo with onClick event handler */}
            <img src={Profile} alt="Profile" style={profileStyle} onClick={handleProfileClick} />
        </header>
    );
};

// Inline styles for header and profile photo
const headerStyle = {
    background: 'rgb(251 184 184)',
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
    borderRadius: '50%', // Makes the image circular
    cursor: 'pointer', // Change cursor to pointer on hover
};

export default Header;
