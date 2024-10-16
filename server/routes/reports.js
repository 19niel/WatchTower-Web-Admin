import express from 'express';
import {
  getReports,         // Fetch all reports
  createReport,       // Create a new report
  getReportById,      // Fetch a report by its ID
  updateReport,       // Update a report by its ID
  deleteReport        // Delete a report by its ID
} from '../controllers/reports.js';

const router = express.Router();

// Fetch all reports
router.get('/', getReports);

// Create a new report
router.post('/', createReport);

// Fetch a report by ID
router.get('/:id', getReportById);

// Update a report by ID
router.put('/:id', updateReport);

// Delete a report by ID
router.delete('/:id', deleteReport);

export default router;
