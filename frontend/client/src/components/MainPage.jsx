import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hiro from './Hiro';
import About from './About'
// import Service from './Services';

const MainPage = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            console.log(`Hash: ${location.hash}`);
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.log(`Element not found for hash: ${location.hash}`);
            }
        }
    }, [location]);


  return (
    <>
    <Hiro id="home" />
    <About id="about" />
    {/* <Service /> */}
    </>
  )
}

export default MainPage