import express from "express";
import multer from "multer"; // Import multer
import { getReports, getReportById, createReport, updateReport, deleteReport, getImage, getUnverifiedReports, acceptRescuerAndUpdatePriority  } from "../controllers/reports.js";
import { exec } from "child_process"; // Import exec to run Python script
import Report from "../models/Report.js"; // Assuming Report model is imported

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Existing GET route
router.get("/", getReports); // Route to fetch reports

// Add the route to fetch a single report by its ID
router.get("/:id", getReportById);  // Fetch report by ID

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
    // Update the report status to "verified"
    await Report.findByIdAndUpdate(id, { disasterStatus: "verified" });
    res.status(200).send({ message: "Report verified successfully." });
  } catch (error) {
    res.status(500).send({ message: "Error verifying report.", error });
  }
});

  // Use the combined route for accepting rescuer and updating priority
router.put("/:id/accept", acceptRescuerAndUpdatePriority); 



// Update a report by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { priority, disasterStatus } = req.body;

  try {
    const report = await Report.findByIdAndUpdate(
      id,
      { priority, disasterStatus },
      { new: true } // Return the updated document
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Error updating report" });
  }
});

export default router;
