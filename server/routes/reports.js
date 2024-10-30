import express from "express";
import multer from "multer"; // Import multer
import { getReports, createReport, updateReport, deleteReport, getImage, getUnverifiedReports } from "../controllers/reports.js";

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Existing GET route
router.get("/", getReports); // Route to fetch reports

// POST route for creating a report
router.post("/", upload.array("disasterImages"), createReport); // Include multer middleware for file uploads

// PATCH route for updating a report by ID
router.patch("/:id", updateReport); // Route to update a report by ID

// DELETE route for deleting a report by ID
router.delete("/:id", deleteReport); // Route to delete a report by ID


router.get('/image/:id', getImage); // Add this line to fetch image by ID

router.get("/pending", getUnverifiedReports); // Add this line


// Activate report endpoint
router.put('/:id/activate', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Update the report status to "active"
      await Report.findByIdAndUpdate(id, { disasterStatus: "active" });
      res.status(200).send({ message: "Report activated successfully." });
    } catch (error) {
      res.status(500).send({ message: "Error activating report.", error });
    }
  });



export default router;
