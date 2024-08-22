import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/Api";
import VideoCards from "../../components/VideoCards";
import SearchFilter from "./SearchFilter";
import { Skeleton } from 'primereact/skeleton';
import { AuthContext } from "../../contexts/AuthContext";
import emptyImage from "../../images/oops.gif"; // Importing the image from the correct path
import './SearchFilter';
import './SearchFilter.css';

function CategoryVideoScreen() {
  const { token } = useContext(AuthContext);
  const { category } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    async function fetchCategoryVideos() {
      setLoading(true);
      try {
        const response = await axios.post(
          API.getVideoByCategories,
          { category },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );
        setVideos(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryVideos();
  }, [category, token]);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = !searchFilter || video.title.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType = !typeFilter || (typeFilter === "mostViewed" && video.views > 0) || (typeFilter === "Latest" && video.uploaded_date);
    
    return matchesSearch && matchesType;
  });

  if (typeFilter === "mostViewed") {
    filteredVideos.sort((a, b) => b.views - a.views);
  }

  if (loading) {
    return <div><Skeleton width="10rem" height="4rem"></Skeleton></div>;
  }

  return (
    <div className="CategoryVideoScreen">
      <h1>{category}</h1>
      <SearchFilter setSearchFilter={setSearchFilter} setTypeFilter={setTypeFilter} searchFilter={searchFilter} typeFilter={typeFilter}/>
      <section>
        {filteredVideos.length > 0 ? (
          <VideoCards videos={filteredVideos} />
        ) : (
          <div className="image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={emptyImage} alt="No videos found"  height={400}/>
   </div>

        )}
      </section>
    </div>
  );
}

export default CategoryVideoScreen;