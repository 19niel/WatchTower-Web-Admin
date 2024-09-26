import express from "express";
import {
  getCitizens,
  getRescuers,
  addCitizen,
  deleteCitizen
} from "../controllers/client.js";

const router = express.Router();

// Removed multer since we're no longer using it
// Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Upload folder, make sure this exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Rename file to avoid conflicts
//   }
// });
// const upload = multer({ storage });

router.get("/citizens", getCitizens);
// Updated POST route to remove multer middleware and expect JSON directly
router.post("/citizens", addCitizen); // <-- Removed upload middleware here
router.get("/rescuers", getRescuers);

// New DELETE route for citizens
router.delete("/citizens/:id", deleteCitizen); // <-- Add this line

export default router;
