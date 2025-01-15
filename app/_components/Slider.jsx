"use client";

import React, { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image";

function Slider({ sliderList }) {
    const [activeVideo, setActiveVideo] = useState(null);

    const handleItemClick = (index) => {
        setActiveVideo(index); 
    };

    return (
        <Carousel className='m-7'
            plugins={[
                Autoplay({
                    delay: 16000,
                }),
            ]}>
            <CarouselContent>
                {sliderList.map((slider, index) => (
                    <CarouselItem
                        key={index}
                        onClick={() => handleItemClick(index)} 
                    >
                        <p>Sesi Açmak İçin Video Üzerine Tıklayınız.</p>
                        <video
                            src={
                                slider.attributes?.image?.data?.attributes?.url.startsWith('http')
                                    ? slider.attributes?.image?.data?.attributes?.url 
                                    : process.env.NEXT_PUBLIC_BACKEND_BASE_URL + slider.attributes?.image?.data?.attributes?.url 
                            }
                            alt="slider"
                            className="w-full h-[200px] md:h-[700px] object-cover rounded-2xl"
                            autoPlay
                            muted={activeVideo !== index}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}

export default Slider;
