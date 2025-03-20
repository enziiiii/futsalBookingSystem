import React, { useEffect, useState } from 'react'
import {useRef} from 'react' 
import Button  from './Button'
import gsap from 'gsap'
import { TiLocationArrow } from 'react-icons/ti'
import { useWindowScroll } from 'react-use'


const navItems = ['Home', 'About', 'Services', 'Contact', 'Login'];

const NavBar = () => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false); // shows us audio is playing
    const [isIndicatorActive, setIsIndicatorActive] = useState(false); // shows us audio indicator is playing on top left corner

    const [lastScrollY, setLastScrollY] = useState(0)
    const [isNavVisible, setIsNavVisible] = useState(true);

    const navContainerRef = useRef(null);
    const audioElementRef = useRef(null);

    // nav visibility on scroll trigger
    const { y: currentScrollY } = useWindowScroll();


    // to show navbar
    useEffect(() => {
        if(currentScrollY === 0) {
            setIsNavVisible(true);     // showing the (dark) navbar visibility. show navbar at top
            navContainerRef.current?.classList.remove('floating-nav');
        } else if(currentScrollY > lastScrollY) {      // which means the user is scrolling down.
            setIsNavVisible(false);     // hide navbar when scrolling down
            navContainerRef.current?.classList.add('floating-nav');
        } else {      
            setIsNavVisible(true);      // show navbarwhen scrolling up
            navContainerRef.current?.classList.add('floating-nav');
        }

        setLastScrollY(currentScrollY);
    }, [currentScrollY]);


    // gsap animation: changes whenever the navbar visibility changes.
    // like when the nav is on top it's transparent and whenever the user scrolls it changes.
    useEffect(() => {
        if (navContainerRef.current) {
            gsap.to(navContainerRef.current, {
                y: isNavVisible ? 0 : -100,
                opacity: isNavVisible ? 1 : 0,
                duration: 0.2,
            });
        }
    }, [isNavVisible])


    const toggleAudioIndicator = () => {
        setIsAudioPlaying((prev) => !prev);

        setIsIndicatorActive((prev) => !prev);
    }

    useEffect(() => {
        if(isAudioPlaying) {
            audioElementRef.current?.play();
        } else {
            audioElementRef.current?.pause();
        }
    }, [isAudioPlaying])

  return (
    <div ref={navContainerRef} className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6">
        <header className="absolute top-1/2 w-full -translate-y-1/2">
            <nav className="flex size-full items-center justify-between p-4">
                <div className="flex items-center gap-7">
                    {/* <img src="/img/logo.png" alt="logo" className="w-10" />

                    <Button /> */}
                </div>

                <div className="flex h-full items-center">
                    <div className="hidden md:flex gap-5">
                        {navItems.map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="nav-hover-btn">
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* audio */}
                    <button className="ml-10 flex items-center space-x-0.5" onClick={toggleAudioIndicator}>
                        {/* hidden audio element */}
                        <audio ref={audioElementRef} className="hidden"
                            src="/audio/loop.mp3" loop />
                    
                        {/* visual audio indicator */}
                        {[1, 2, 3, 4].map((bar) => (
                            <div 
                                key={bar}
                                className={`indicator-line ${isIndicatorActive ? 'active' : ''}`} 
                                style={{ animationDelay: `${bar * 0.1}s`}} 
                            />

                        ))}
    
                    </button>
                </div>
            </nav>
        </header>
    </div>
  )
}

export default NavBar