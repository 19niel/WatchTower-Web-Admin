import OverallStat from "../models/OverallStat.js";
import Report from "../models/Report.js"; // Adjust the path as needed

export const getReports = async (req, res) => {
  try {
    const overallStats = await OverallStat.find();
    res.status(200).json(overallStats[0]); // First array is 2023
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// New function to handle report creation
export const createReport = async (req, res) => {
  const reportData = req.body; // Get the report data from the request body

  try {
    const newReport = new Report(reportData); // Create a new instance of the Report model
    await newReport.save(); // Save it to the database

    res.status(201).json(newReport); // Respond with the created report
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle errors
  }
};
