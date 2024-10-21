import express from "express";
import { getReports, createReport } from "../controllers/reports.js"; // Import the new function

const router = express.Router();

// Existing GET route
router.get("/reports", getReports);

// New POST route for creating a report
router.post("/reports", createReport); // Add this line

export default router;
