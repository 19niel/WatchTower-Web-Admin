import express from "express";
import multer from "multer"; // Import multer
import { getReports, getReportById, createReport, updateReport, deleteReport, getImage, getUnverifiedReports, acceptRescuerAndUpdatePriority  } from "../controllers/reports.js";

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
    // Find the report by ID
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).send({ message: "Report not found." });
    }

    // Extract disasterCategory and disasterInfo for AI
    const { disasterCategory, disasterInfo } = report;

    // Call the Python AI model to assign priority
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python3', ['./ai_model/priority_assigner.py', disasterCategory, disasterInfo]);

    pythonProcess.stdout.on('data', async (data) => {
      const priority = data.toString().trim();

      // Update the report with disasterStatus and priority
      await Report.findByIdAndUpdate(id, {
        disasterStatus: "verified",
        priority: priority
      });

      // Send success response
      res.status(200).send({
        message: "Report verified and priority assigned successfully.",
        priority: priority
      });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`AI Error: ${data}`);
      res.status(500).send({ message: "Error processing AI priority.", error: data.toString() });
    });

  } catch (error) {
    res.status(500).send({ message: "Error verifying report.", error });
  }
});

  // Use the combined route for accepting rescuer and updating priority
router.put("/:id/accept", acceptRescuerAndUpdatePriority); 


export default router;
