import OverallStat from "../models/OverallStat.js";
import Report from '../models/Report.js';
import multer from 'multer';
import multerGridFsStorage from 'multer-gridfs-storage';
import mongoose from 'mongoose';

// Configure GridFS storage
const storage = new multerGridFsStorage({
  url: process.env.MONGO_URL,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads', // The name of the GridFS bucket
    };
  },
});

const upload = multer({ storage });

// Upload images middleware
export const uploadImages = upload.array('images', 5); // Adjust 'images' based on your form field

// Fetch all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('reporterId rescuerId'); // Populating Citizen and Rescuer details
    res.status(200).json(reports);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Fetch a single report by ID
export const getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id).populate('reporterId rescuerId');
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { reporterId, reportedBy, location, disasterCategory, disasterInfo, rescuerId, isVerified } = req.body;
    
    // Retrieve image IDs from req.files if using multer
    const disasterImages = req.files ? req.files.map(file => file.id) : []; // Handle multiple images

    const newReport = new Report({
      reporterId,
      reportedBy,
      location,
      disasterCategory,
      disasterImage: disasterImages, // Store array of image IDs
      disasterInfo,
      rescuerId,
      isVerified,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport); // Return the saved report
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a report by ID
export const updateReport = async (req, res) => {
  const { id } = req.params;
  const reportUpdates = req.body;

  try {
    const updatedReport = await Report.findByIdAndUpdate(id, reportUpdates, { new: true }).populate('reporterId rescuerId');
    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(updatedReport); // Return the updated report
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a report by ID
export const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReport = await Report.findByIdAndDelete(id);
    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report successfully deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  uploadImages,
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
