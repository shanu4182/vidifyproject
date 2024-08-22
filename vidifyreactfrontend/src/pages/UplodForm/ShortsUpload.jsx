import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import API from "../../services/Api"; // Adjust the import according to your project structure
import { AuthContext } from "../../contexts/AuthContext";
import ChooseCard from "../../components/ChooseCard"; // Adjust the import according to your project structure

function ShortsUpload() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [generatedThumbnail, setGeneratedThumbnail] = useState(null); // For storing the generated thumbnail
  const [video, setVideo] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
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
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchCategories();
    fetchLanguages();
  }, [token]);

  const handleVideoUpload = (file) => {
    if (video) {
      URL.revokeObjectURL(video); // Clean up the previous video URL
    }

    const url = URL.createObjectURL(file);
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = url;

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      setVideoDuration(duration);
      if (duration <= 60) {
        setVideo(file);
      } else {
        alert("Video exceeds the maximum allowed duration of 60 seconds. Please trim your video before uploading.");
        setVideo(null);
      }
    };
  };

  const generateThumbnail = () => {
    if (!video || isGenerating) {
      return;
    }

    setIsGenerating(true);

    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(video);

    videoElement.onloadedmetadata = () => {
      const randomTime = Math.random() * videoElement.duration;
      videoElement.currentTime = randomTime;
    };

    videoElement.onseeked = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const generatedThumbnail = new File([blob], "thumbnail.png", {
          type: "image/png",
        });
        setThumbnail(generatedThumbnail);
        setGeneratedThumbnail(URL.createObjectURL(generatedThumbnail)); // Set the preview
        setIsGenerating(false);
      });
    };

    videoElement.onerror = () => {
      alert("An error occurred while generating the thumbnail.");
      setIsGenerating(false);
    };
  };

  const uploadVideo = () => {
    if (!video || !thumbnail) {
      alert("Please select both a video and generate a thumbnail before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category_name", category);
    formData.append("language", language);
    formData.append("duration", videoDuration);
    formData.append("thumbnail", thumbnail);
    formData.append("file", video);

    axios
      .post(API.addShorts, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Success:", response.data);
        alert("Upload Successfully");
        resetFields();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Upload failed: " + error.message);
      });
  };

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setThumbnail(null);
    setGeneratedThumbnail(null); // Reset the generated thumbnail URL
    setVideo(null);
    setVideoDuration(0);
    setCategory("");
    setLanguage("");
  };

  return (
    <div>
      <h2>Upload Shorts</h2>

      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
        <div>
          <label>Upload Thumbnail</label>
          <ChooseCard
            placeholder="Click to select thumbnail"
            onFileSelect={setThumbnail}
            acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
            preview={generatedThumbnail} // Pass the generated thumbnail preview
          />
        </div>

        <div>
          <label>Upload Video</label>
          <ChooseCard
            placeholder="Click to select video"
            onFileSelect={handleVideoUpload}
            acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
          />
        </div>
      </div>

      {video && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button
            onClick={generateThumbnail}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "5px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Thumbnail"}
          </button>
        </div>
      )}

      {videoDuration <= 60 && video && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={uploadVideo}
            style={{
              backgroundColor: "#007BFF",
              marginTop: "10px",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "5px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007BFF")}
          >
            Upload Video
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default ShortsUpload;
