import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import VideoCards from "../../components/VideoCards"; // Import your VideoCards component
import "./carousel.css"

const Carousel = ({ videos }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {videos.map((video, index) => (
          <div key={index} className="video-slide">
            <VideoCards videos={[video]} /> 
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;