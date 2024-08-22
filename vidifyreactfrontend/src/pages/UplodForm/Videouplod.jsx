import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import ChooseCard from "../../components/ChooseCard"; // Adjust the path as needed

const VideoUpload = () => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // For displaying the thumbnail
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [duration, setDuration] = useState("");
  const [isGenerating, setIsGenerating] = useState(false); // Track if thumbnail is being generated
  const canvasRef = useRef(null);

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
        console.log("Fetched languages:", response.data);
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchCategories();
    fetchLanguages();
  }, [token]);

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
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const generateThumbnail = () => {
    if (!file || isGenerating) {
      return;
    }

    setIsGenerating(true);

    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);

    // Generate a random time between 0 and the video duration
    video.onloadedmetadata = () => {
      const randomTime = Math.random() * video.duration;
      video.currentTime = randomTime;
    };

    video.onseeked = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const generatedThumbnail = new File([blob], "thumbnail.png", {
          type: "image/png",
        });
        setThumbnail(generatedThumbnail);
        setThumbnailPreview(URL.createObjectURL(generatedThumbnail)); // Set the preview
        setIsGenerating(false);
      });
    };

    video.onerror = () => {
      alert("An error occurred while generating the thumbnail.");
      setIsGenerating(false);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !thumbnail) {
      alert("Please select both video and thumbnail files");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("thumbnail", thumbnail);
      formData.append("category_name", category);
      formData.append("language", language);
      formData.append("duration", duration);

      await axios.post(API.addVideo, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Video added successfully");
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="uploadForm">
      <div className="uploadFormTitleDescription">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video Title"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={6}
          required
        />
      </div>
      <div className="uploadFormImageVideo">
        <ChooseCard
          placeholder="Click to select thumbnail"
          onFileSelect={handleThumbnailChange}
          acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
          preview={thumbnailPreview} // Pass the generated thumbnail preview
        />

        <ChooseCard
          placeholder="Click to select video"
          onFileSelect={handleFileChange}
          acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
        />
      </div>
      <div className="uploadFormDropdown">
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

        <button type="button" onClick={generateThumbnail} disabled={isGenerating}>
          {isGenerating ? "Generating..." : " Click Here To Regenerate"}
        </button>
        <button type="submit">Submit</button>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </form>
  );
};

export default VideoUpload;
