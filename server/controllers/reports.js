import Report from "../models/Report.js"; // Adjust the path as needed

// Function to get all reports from the Report collection
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find(); // Fetch all reports from the Report collection
    res.status(200).json(reports); // Return the reports
  } catch (error) {
    res.status(404).json({ message: error.message }); // Handle any errors
  }
};

// Function to handle report creation
export const createReport = async (req, res) => {
  // Get report data from the request body
  const reportData = {
    reporterId: req.body.reporterId,
    reportedBy: req.body.reportedBy,
    location: req.body.location,
    disasterCategory: req.body.disasterCategory,
    disasterInfo: req.body.disasterInfo,
    disasterStatus: req.body.disasterStatus,
    priority: req.body.priority,
    rescuerId: req.body.rescuerId,
    rescuedBy: req.body.rescuedBy,
    disasterImages: req.files ? req.files.map(file => file.id) : [], // Extract file IDs
  };

  try {
    const newReport = new Report(reportData); // Create a new instance of the Report model
    await newReport.save(); // Save it to the database

    res.status(201).json(newReport); // Respond with the created report
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle errors
  }
};

// Function to delete a report by ID
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params; // Get the report ID from the request parameters
    const deletedReport = await Report.findByIdAndDelete(id); // Delete the report by ID

    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' }); // Handle case where report doesn't exist
    }

    res.status(200).json({ message: 'Report deleted successfully' }); // Respond with success message
  } catch (error) {
    console.error("Error deleting report:", error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to delete report' }); // Handle any errors
  }
};

// Function to handle report updating
export const updateReport = async (req, res) => {
  const { id } = req.params; // Get the report ID from the request parameters
  const updatedData = req.body; // Get the updated data from the request body

  try {
    const updatedReport = await Report.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true }); // Update the report

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' }); // Handle case where report doesn't exist
    }

    res.status(200).json(updatedReport); // Respond with the updated report
  } catch (error) {
    console.error("Error updating report:", error); // Log the error for debugging
    res.status(400).json({ message: error.message }); // Handle errors
  }
};
