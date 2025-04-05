
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';
import '../styles/components/bottomnav.css';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';

const BottomNav = () => {
    const { user } = useAuth();
    

    return(

        <>
            <div className='bottom-nav'>
                <div>
                     <Link to="/map">
                    <MapRoundedIcon className='map-icon' sx={{ fontSize: 40 }} />
                    </Link>
                </div>

                <div>
                    <Link to="/home">
                    <HomeRoundedIcon className='home-icon' sx={{ fontSize: 40 }} />
                    </Link>
                </div>
               
                <div>
                    <Link to="/friends">
                    <PeopleAltRoundedIcon className='friends-icon' sx={{ fontSize: 40
                     }} />
                    </Link>
                </div>
                 
            </div>
        </>
    );
}

export default BottomNav;