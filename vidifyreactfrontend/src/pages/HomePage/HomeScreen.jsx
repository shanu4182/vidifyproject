import React, { useEffect, useState } from 'react';
import Carousel from './Carousel'; // Adjust the path if needed
import API from '../../services/Api';
import axios from "axios";


function HomeScreen() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(API.getHomeVideos);
        setVideos(response.data);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError('Failed to load videos.');
      }
    };

    fetchVideos();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
<div>
  <h1>HomeScreen</h1>
  {videos.length > 0 ? <Carousel videos={videos} /> : <div>Loading...</div>}
</div>

  );
}

export default HomeScreen;
