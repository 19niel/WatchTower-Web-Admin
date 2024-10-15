import Report from '../models/Report.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { reporterId, reportedBy, location, disasterCategory, disasterImage, disasterInfo, rescuerId, isVerified } = req.body;

    const newReport = new Report({
      reporterId,
      reportedBy,
      location,
      disasterCategory,
      disasterImage,
      disasterInfo,
      rescuerId,
      isVerified,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('reporterId rescuerId'); // Populating Citizen and Rescuer details
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('reporterId rescuerId');
    if (!report) return res.status(404).json({ message: 'Report not found' });

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a report
export const updateReport = async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('reporterId rescuerId');
    if (!updatedReport) return res.status(404).json({ message: 'Report not found' });

    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: 'Report not found' });

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};