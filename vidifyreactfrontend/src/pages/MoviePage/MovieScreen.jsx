import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../../services/Api";
import MovieCards from "../../components/MovieCards";
import { Skeleton } from 'primereact/skeleton';
import { AuthContext } from "../../contexts/AuthContext";
import SearchFilter from "../CategoryVideosPage/SearchFilter";

function MovieScreen() {
  const { token } = useContext(AuthContext);
  const { category } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState(""); // State for search query
  const [typeFilter, setTypeFilter] = useState(""); // State for type filter

  // Fetch movies from API
  useEffect(() => {
    async function fetchCategoryMovies() {
      setLoading(true);
      try {
        const response = await axios.get(
          API.getMovies,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMovies(response.data);
        console.log("Fetched Movies:", response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryMovies();
  }, [token, category]);

  // Apply search and type filters
  const filteredMovies = movies.filter(movie => {
    const title = movie.title || "";  // Ensure title is a string
    const matchesSearch = title.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType = typeFilter === "" || 
                       (typeFilter === "mostViewed" && movie.mostViewed) || 
                       (typeFilter === "Latest" && movie.isLatest);

    // Debug logs
    console.log(`Filtering: title="${title}", searchFilter="${searchFilter}", matchesSearch=${matchesSearch}, matchesType=${matchesType}`);

    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div><Skeleton width="10rem" height="4rem" /></div>;
  }

  return (
    <div className="MoviePageScreen">
      <SearchFilter
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      <section>
        {filteredMovies.length > 0 ? (
          <MovieCards videos={filteredMovies} />
        ) : (
          <p>No movies found for this category.</p>
        )}
      </section>
    </div>
  );
}

export default MovieScreen;
