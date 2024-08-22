import express from "express";
import cors from "cors";
import { json } from "express";
import { addVideo, getCategories, getLanguages, getVideos, getVideosByCategories, addMovie,addShorts,getMovies, getShorts,getHomeVideos } from "./service/videoService.js";
import {
  loginService,
  registerService,
  verifyOTPService,
} from "./service/authService.js";
import { authenticateToken } from "./middleware/authMiddleware.js";

const app = express();
app.use(cors());
app.use(json());

// Serve static files from the 'uploads/videos' and 'uploads/thumbnails' directories
app.use('/uploads/videos', express.static('uploads/videos'));
app.use('/uploads/thumbnails', express.static('uploads/thumbnails'));
app.use('/uploads/trailers', express.static('uploads/trailers'));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  registerService(req, res);
});

app.post("/login", async (req, res) => {
  loginService(req, res);
});

app.post("/verify-otp", async (req, res) => {
  verifyOTPService(req, res);
});

app.get("/getVideos", async (req, res) => {
  getVideos(req, res);
});

app.post("/getVideoByCategories", authenticateToken, async (req, res) => {
  getVideosByCategories(req, res);
});

app.get("/getCategories", async (req, res) => {
  getCategories(req, res);
});

app.get("/getLanguages", async (req, res) => {
  getLanguages(req, res);
});

app.post("/addVideo", authenticateToken, async (req, res) => {
  addVideo(req, res);
});

app.post("/addMovie", authenticateToken, async (req, res) => {
  addMovie(req, res);
});

app.post("/addShorts", authenticateToken, async (req, res) => {
  addShorts(req, res);
});


app.get("/getMovies", authenticateToken, async (req, res) => {
  getMovies(req, res);
});


app.get("/getShorts", async (req, res) => {
  console.log("shorts");
  const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
  getShorts(req, res, page, limit);
});

app.get("/getHomeVideos", async (req, res) => {
  getHomeVideos(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
