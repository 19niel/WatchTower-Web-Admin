import OverallStat from "../models/OverallStat.js";
import Report from '../models/Report.js';

// Fetch all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find(); // Fetch all reports
    res.status(200).json(reports);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Fetch a single report by ID
export const getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id);
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
  const newReport = new Report(req.body); // Get the report details from the request body
  try {
    const savedReport = await newReport.save(); // Save the report in the database
    res.status(201).json(savedReport); // Return the saved report
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Update a report by ID
export const updateReport = async (req, res) => {
  const { id } = req.params;
  const reportUpdates = req.body;

  try {
    const updatedReport = await Report.findByIdAndUpdate(id, reportUpdates, { new: true });
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