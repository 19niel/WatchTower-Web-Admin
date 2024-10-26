import express from "express";
import { getReports, createReport, updateReport, deleteReport } from "../controllers/reports.js"; // Import the new function

const router = express.Router();

// Existing GET route
router.get("/", getReports); // Route to fetch reports

// POST route for creating a report
router.post("/", createReport); // Route to create a new report

// PATCH route for updating a report by ID
router.patch("/:id", updateReport); // Route to update a report by ID

// DELETE route for deleting a report by ID
router.delete("/:id", deleteReport); // Route to delete a report by ID

export default router;
