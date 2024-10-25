import express from "express";
import {
  getPendingReports,
  activateReport,
  deleteReport,
} from "../controllers/pendingReports.js"; // Ensure the .js extension

const router = express.Router();

// Route to get all pending reports
router.get("/", getPendingReports);

// Route to activate a report and set its priority
router.patch("/:id/activate", activateReport);

// Route to delete a report
router.delete("/:id", deleteReport);

export default router;
