import Report from "../models/Report.js"; // Ensure this matches your model name

// Get all reports with pending status
export const getPendingReports = async (req, res) => {
  try {
    const pendingReports = await Report.find({ disasterStatus: "pending" });
    res.status(200).json(pendingReports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending reports", error });
  }
};

// Activate a report by updating status and priority
export const activateReport = async (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;

  try {
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { disasterStatus: "active", priority },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: "Error activating report", error });
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

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report", error });
  }
};
