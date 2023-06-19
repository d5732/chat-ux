import React from 'react'
import { Outlet } from "react-router-dom";
import AuthFooter from "./AuthFooter";
import AuthNavbar from "./AuthNavbar";

const Auth = () => {
    return (
        <div className='rounded-md w-[400px]'>
            <AuthNavbar />
            <Outlet />
            <AuthFooter />
        </div>
    );
}

export default Auth;
