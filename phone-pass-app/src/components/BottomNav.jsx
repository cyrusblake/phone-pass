
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';
import '../styles/components/bottomnav.css';

const BottomNav = () => {
    const { user } = useAuth();
    

    return(

        <>
            <div className='bottom-nav'>
                <Link to="/map">
                    <h4>Map</h4>
                </Link>
                <Link to="/home">
                    <h4>Home</h4>
                </Link>
                <Link to="friends">
                    <h4>Friends</h4>
                </Link> 
            </div>
        </>
    );
}

export default BottomNav;