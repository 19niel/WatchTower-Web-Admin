import express from "express";
import { getReports, createReport } from "../controllers/reports.js"; // Import the new function

const router = express.Router();

// Existing GET route
router.get("/", getReports); // Change this line

// New POST route for creating a report
router.post("/", createReport); // Change this line

export default router;
