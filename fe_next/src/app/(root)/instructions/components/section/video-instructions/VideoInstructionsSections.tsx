"use client";
import Image from "next/image";
import { useState } from "react";

const VideoInstructionsSections = () => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const handleSectionClick = () => {
    setIsVideoVisible(true);
  };

  const handleCloseVideo = () => {
    setIsVideoVisible(false);
  };

  return (
    <div className="relative">
      <section
        className="relative mb-[38.55px] w-full aspect-[1240/635.5] rounded-[20px] overflow-hidden flex items-center justify-center cursor-pointer"
        onClick={handleSectionClick}
      >
        <div className="absolute left-0 top-0 aspect-[1240/635.5] w-full">
          <Image
            src="/images/play-video-image/video-banner.jpg"
            alt="banner"
            className="object-cover"
            fill
          />
        </div> 
        <div
          className="absolute z-[1] aspect-[152/152] lg:w-[152px] md:w-[96px] w-[56px]" /*unclass (hidden) */
        >
          <Image
            src="/images/play-video-image/play-button.png"
            alt="banner"
            className="object-cover"
            fill
          />
        </div>
      </section>

      {isVideoVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[10000000]"
          onClick={handleCloseVideo}
        >
          <div className="relative rounded-lg p-4 max-w-[1240px] w-full ">
            <iframe
              className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto aspect-[16/9]"
              src="https://www.youtube.com/embed/-Pg819il8lY?autoplay=1"
              title="YouTube video player"
              style={{ border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoInstructionsSections;
