// import React, { useEffect } from 'react'
import { useRef, useState, useEffect } from 'react';
import Button  from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Hiro = () => {
    // const [currentIndex, setCurrentIndex] = useState(1);
    // const [hasClicked, setHasClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);

    // const totalVideos = 3;
    const nextVideoRef = useRef(null);

    const handleVideoLoad = () => {
        // setLoadedVideos((prev) => prev + 1);
        setIsLoading(false);
    }

    // const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

    // // when a user click on the mini video and it expands
    // const handleMiniVdClick = () => {
    //     setHasClicked(true);

    //     setCurrentIndex(upcomingVideoIndex);
    // }

    useEffect(() => {
        if(loadedVideos >= totalVideos) {
            setIsLoading(false);
        }
    }, [loadedVideos, totalVideos]);


    useGSAP( () => {
        gsap.set('#video-frame', {
            clipPath: 'polygon(5% 0%, 72% 0%, 96% 94%, 0% 100%)',
            borderRadius: '0 0 40% 10%'
        })

        gsap.from('#video-frame', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            borderRadius: '0 0 0 0',
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: '#video-frame',
                start: 'center center',
                end: 'bottom center',
                scrub: true,
            }
        })
    })


    const getVideoSrc = (index) => `videos/hiro-${index}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">

        {isLoading && (
            <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen z-[999] bg-violet-50">
                <div className="three-body">
                    <div className="three-body__dot" />
                    <div className="three-body__dot" />
                    <div className="three-body__dot" />
                </div>
            </div>
        )}

        <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75">
            <div>
                {/* <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
                    <div onClick={handleMiniVdClick} className="origin-center scale-50 opacity-0 transitin-all duration-500 ease-in hover:scale-100 hover:opacity-100">
                        <video 
                            ref={nextVideoRef} 
                            src={getVideoSrc(upcomingVideoIndex)}
                            loop
                            muted
                            id="current-video"
                            className="size-64 origin-center scale-150 object-cover object-center"
                            onLoadedData={handleVideoLoad}
                        />
                    </div>
                </div> */}

                {/* <video 
                    ref={nextVideoRef}
                    src={getVideoSrc(currentIndex)}
                    loop
                    muted
                    id="next-video"
                    className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
                    onLoadedData={handleVideoLoad}
                /> */}
                
                <video 
                    src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
                    autoPlay
                    loop
                    muted
                    className="absolute left-0 top-0 size-full object-cover object-center"
                    onLoadedData={handleVideoLoad}
                />
            </div> 

            <h1 className="special-font hiro-heading absolute bottom-5 right-1 z-40 text-blue-75 text-2xl lg:text-4xl xl:text-5xl font-bold">
                F<b>u</b>tsal
            </h1>

            <div className="absolute left-0 top-0 z-40 size-full">
                <div className="mt-10 px-5 sm:px-10 mr-10">
                    <h1 className="special-font hiro-heading text-blue-100 text-2xl lg:text-4xl xl:text-5xl"><b>U</b>nited Arena</h1>
                    <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
                        Learn about us
                    </p>
                    
                    <Button id="watch-trailer" title="Watch Clip" leftIcon={<TiLocationArrow />} containerClass="!bg-purple-300 flex-center gap-1" />
                </div>
            </div>
        </div>
        <h1 className="special-font hiro-heading absolute bottom-5 right-1 text-black-75 text-2xl lg:text-4xl xl:text-5xl font-bold">
                F<b>u</b>tsal
        </h1>
    </div>
  )
}

export default Hiro