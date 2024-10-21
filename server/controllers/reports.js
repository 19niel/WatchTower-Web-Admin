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
  const reportData = req.body; // Get the report data from the request body

  try {
    const newReport = new Report(reportData); // Create a new instance of the Report model
    await newReport.save(); // Save it to the database

    res.status(201).json(newReport); // Respond with the created report
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle errors
  }
};
