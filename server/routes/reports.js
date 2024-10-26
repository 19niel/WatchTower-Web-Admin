import express from "express";
import { getReports, createReport, updateReport, deleteReport } from "../controllers/reports.js"; 
import { upload } from '../grid.js'; // Import the upload middleware

const router = express.Router();

// Existing GET route
router.get("/", getReports); // Route to fetch reports

// POST route for creating a report with image uploads
router.post("/", (req, res, next) => {
  upload.array("disasterImages", 10)(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: "Image upload failed", error });
    }
    next(); // Proceed to the createReport function if upload is successful
  });
}, createReport); // Modify this line

// PATCH route for updating a report by ID
router.patch("/:id", updateReport); // Route to update a report by ID

// DELETE route for deleting a report by ID
router.delete("/:id", deleteReport); // Route to delete a report by ID

export default router;