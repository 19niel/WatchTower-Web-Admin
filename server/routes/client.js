import express from "express";
import multer from "multer"; // for uploading images to MongoDB
import {
  getCitizens,
  getRescuers,
  addCitizen,
} from "../controllers/client.js";

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload folder, make sure this exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename file to avoid conflicts
  }
});
const upload = multer({ storage });

const router = express.Router();

// Adjusted POST route to include the multer middleware for file uploads
router.get("/citizens", getCitizens);
router.post("/citizens", upload.single("profileImage"), addCitizen); // <-- Include upload middleware here
router.get("/rescuers", getRescuers);

export default router;
