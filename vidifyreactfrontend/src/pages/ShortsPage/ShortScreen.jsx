import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API from '../../services/Api';
import ShortsCards from '../../components/ShortsCard';
import '../../pages/ShortsPage/ShortsScreen.css';

function ShortScreen() {
  const [shorts, setShorts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchShorts = useCallback(async () => {
    try {
      const response = await axios.get(`${API.getShorts}?page=${page}`);
      setShorts((prevShorts) => [...prevShorts, ...response.data]);
      setHasMore(response.data.length > 0); // If no data is returned, stop further requests
    } catch (error) {
      console.error("Error fetching shorts:", error);
    }
  }, [page]);

  useEffect(() => {
    fetchShorts();
  }, [fetchShorts]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ 
    display: "flex", 
    alignItems: "center", 
    flexDirection: "column", 
    width: "100%",
    justifyContent: "center" /* Centers the content vertically within the div */
}}>

      {shorts.map((short, index) => (
        <ShortsCards key={index} short={short} />
      ))}
      {!hasMore && <p>No more videos to load.</p>}
    </div>
  );
}

export default ShortScreen;
