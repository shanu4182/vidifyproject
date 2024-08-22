import db from "../config/db.js";
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "file") {
      cb(null, 'uploads/videos/');
    } else if (file.fieldname === "thumbnail") {
      cb(null, 'uploads/thumbnails/');
    } else if (file.fieldname === "trailer") {
      cb(null, 'uploads/trailers/');
    }
  },
  
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'trailer', maxCount: 1 }
]);

// Function to get videos
async function getVideos(req, res) {
  const { uploaded_by } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM `videos` WHERE uploaded_by = ?", [uploaded_by]);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// Function to get categories
async function getCategories(req, res) {
  console.log(req.user);
  try {
    const [rows] = await db.query("SELECT * FROM `categories`");
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// Function to get videos by categories
async function getVideosByCategories(req, res) {
  const { category } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM `videos` WHERE category_name = ?", [category]);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function getMovies(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM movies'); // Ensure the query is correct
    res.json(rows);
  } catch (err) {
    console.error('Error fetching movies:', err); // Log the error
    res.status(500).send('Internal Server Error');
  }
}



async function getShorts(req, res, page, limit) {
  const offset = (page - 1) * limit;
  try {
    const [rows] = await db.query('SELECT * FROM shorts LIMIT ?, ?', [offset, parseInt(limit)]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching shorts:', err);
    res.status(500).send('Internal Server Error');
  }
}

// Function to get languages
async function getLanguages(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM `languages`");
    res.json(rows);
  } catch (err) {
    console.error('Error fetching languages:', err);
    res.status(500).send('Internal Server Error');
  }
}

async function getHomeVideos(req, res) {
  console.log(req.user);
  try {
    const [rows] = await db.query("SELECT * FROM `videos`");
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
// Function to add a video
async function addVideo(req, res) {
  const { userId, username } = req.user;
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    const { title, description, category_name, language, duration } = req.body;
    const file = req.files.file[0];
    const thumbnail = req.files.thumbnail[0];

    if (!title || !description || !category_name || !language || !duration || !file || !thumbnail) {
      return res.status(400).send('Missing required fields or files');
    }

    try {
      await db.query(
        "INSERT INTO `videos` (title, description, category_name, language, file_path, thumbnail_path, uploaded_by, uploader_id, uploaded_date, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
        [title, description, category_name, language, file.path, thumbnail.path, username, userId, duration]
      );

      res.status(201).send("Video added successfully");
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
}

async function addShorts(req, res) {
  const { userId, username } = req.user;

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err.message);
      return res.status(500).send('File upload error');
    } else if (err) {
      console.error('Unknown error:', err.message);
      return res.status(500).send('Unknown error occurred');
    }

    const { title, description, category_name, language, duration } = req.body;
    const file = req.files && req.files.file ? req.files.file[0] : null;
    const thumbnail = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;

    // Check for missing fields
    if (!title) {
      return res.status(400).send('Missing required field: title');
    }
    if (!description) {
      return res.status(400).send('Missing required field: description');
    }
    if (!category_name) {
      return res.status(400).send('Missing required field: category_name');
    }
    if (!language) {
      return res.status(400).send('Missing required field: language');
    }
    if (!duration) {
      return res.status(400).send('Missing required field: duration');
    }
    if (!file) {
      return res.status(400).send('Missing required file: video file');
    }
    if (!thumbnail) {
      return res.status(400).send('Missing required file: thumbnail');
    }

    try {
      await db.query(
        "INSERT INTO `shorts` (title, description, category_name, language, file_path, thumbnail_path, uploaded_by, uploader_id, uploaded_date, duration, content_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'shorts')",
        [title, description, category_name, language, file.path, thumbnail.path, username, userId, duration]
      );

      res.status(201).send("Shorts added successfully");
    } catch (err) {
      console.error('Database error:', err.message);
      res.status(500).send(`Error inserting shorts into database: ${err.message}`);
    }
  });
}

// Function to add a movie
async function addMovie(req, res) {
  const { userId, username } = req.user;
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err.message);
      return res.status(500).send('File upload error');
    } else if (err) {
      console.error('Unknown error:', err.message);
      return res.status(500).send('Unknown error occurred');
    }

    const { name, description, category_name, language, releaseDate, duration } = req.body;
    const file = req.files.file ? req.files.file[0] : null;
    const thumbnail = req.files.thumbnail ? req.files.thumbnail[0] : null;
    const trailer = req.files.trailer ? req.files.trailer[0] : null;

    if (!name || !description || !category_name || !language || !releaseDate || !duration || !file || !thumbnail || !trailer) {
      return res.status(400).send('Missing required fields or files');
    }

    try {
      await db.query(
        "INSERT INTO `movies` (name, description, thumbnail, trailer, file_path, category_name, releaseDate, language, uploaded_by, uploader_id, uploaded_date, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
        [name, description, thumbnail.path, trailer.path, file.path, category_name, releaseDate, language, username, userId, duration]
      );

      res.status(201).send("Movie added successfully");
    } catch (err) {
      console.error('Database error:', err.message);
      res.status(500).send(`Error inserting movie into database: ${err.message}`);
    }
  });
}

// Export all functions
export { getVideos, getVideosByCategories, getLanguages, addVideo, getCategories, addMovie,addShorts,getMovies,getShorts,getHomeVideos};
