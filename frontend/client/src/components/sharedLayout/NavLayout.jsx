import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';


// Created this .js because, not to show the navbar after the user is logged in
const NavLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet /> {/* Renders nested routes */}
        </>
    );
};

export default NavLayout;