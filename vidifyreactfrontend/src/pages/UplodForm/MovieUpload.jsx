import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import ChooseCard from "../../components/ChooseCard"; // Adjust the import path as needed

const MovieUpload = () => {
  const { token } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API.getCategories);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(API.languages);
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchCategories();
    fetchLanguages();
  }, []);

  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith("video/")) {
      alert("Please select a valid video file");
      return;
    }
    setFile(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const videoDuration = Math.floor(video.duration);
      const hours = Math.floor(videoDuration / 3600);
      const minutes = Math.floor((videoDuration % 3600) / 60);
      const seconds = videoDuration % 60;
      setDuration(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };
    video.src = URL.createObjectURL(file);
  };

  const handleThumbnailChange = (file) => {
    setThumbnail(file);
  };

  const handleTrailerChange = (file) => {
    setTrailer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !thumbnail || !trailer) {
      alert("Please select video file, thumbnail, and trailer file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("thumbnail", thumbnail);
      formData.append("trailer", trailer);
      formData.append("category_name", category);
      formData.append("releaseDate", releaseDate);
      formData.append("language", language);
      formData.append("duration", duration);

      await axios.post(API.addMovie, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Movie added successfully");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to add movie: ${
            error.response.data.message || error.response.data
          }`
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("Failed to add movie: No response from server.");
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to add movie: ${error.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="movieImageVideoUpload">
        <div>
          <label>Video File:</label>
          <ChooseCard
            placeholder="Click to select video"
            onFileSelect={handleFileChange}
            acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
          />
        </div>
        <div>
          <label>Thumbnail:</label>
          <ChooseCard
            placeholder="Click to select thumbnail"
            onFileSelect={handleThumbnailChange}
            acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
          />
        </div>
        <div>
          <label>Trailer:</label>
          <ChooseCard
            placeholder="Click to select trailer"
            onFileSelect={handleTrailerChange}
            acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
          />
        </div>
      </div>

      <div>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
        >
          <option value="">Select a language</option>
          {languages.map((lang) => (
            <option key={lang.id} value={lang.language_name}>
              {lang.language_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Release Date:</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MovieUpload;
