import React, { useState, useEffect, useRef } from 'react';
import API from '../services/Api';

const ShortsCards = ({ short }) => {
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      {
        threshold: 0.5, // Video will start playing when 50% visible
      }
    );

    if (videoRef.current) {
      observerRef.current.observe(videoRef.current);
    }

    return () => {
      if (observerRef.current && videoRef.current) {
        observerRef.current.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error playing video:', error);
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="short-card">
      <video
        ref={videoRef}
        src={API.main + short.file_path}
        muted
        loop
        onClick={handleVideoClick}
        style={{ 
          width: '100%', 
          height: '500px', /* Set specific height for the video */
          maxHeight: '500px', 
          objectFit: 'cover' /* Ensures the video covers the container */
        }}
      />
      <div className="details">
        <h2>{short.title}</h2>
        <p>{short.description}</p>
      </div>
    </div>
  );
};

export default ShortsCards;
