import React from 'react';
    import {Outlet} from 'react-router-dom'
import NavBar from '../../Components/Header/NavBar';

const LandingPageLayout = () => {
    return (
        <>  
            <div className='h-screen'>
                <NavBar />
                <Outlet />
                
            </div>
        </>
    );
};

export default LandingPageLayout;