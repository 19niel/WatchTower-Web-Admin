import express from 'express';
import {
  getAllReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport,
  uploadImages // Import the upload middleware
} from '../controllers/reports.js';

const router = express.Router();

// Fetch all reports
router.get('/', getAllReports);

// Create a new report with images
router.post('/', uploadImages, createReport); // Use the multer middleware here

// Fetch a report by ID
router.get('/:id', getReportById);

// Update a report by ID
router.put('/:id', updateReport);

// Delete a report by ID
router.delete('/:id', deleteReport);

export default router;
