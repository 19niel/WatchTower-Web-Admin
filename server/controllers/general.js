import OverallStat from "../models/OverallStat.js";
import Admin from "../models/Admin.js"; // Import the Admin model

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id); // Fetch admin instead of user
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



export const getAdmin = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you will fetch by admin ID
    const admin = await Admin.findById(id); // Fetch admin by ID
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin); // Return the fetched admin
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // hardcoded values
    const currentMonth = "January";
    const currentYear = 2023;
    const currentDay = "2023-01-01";

      // /* Recent reports this is not finished */
      // const reports = await Report.find()
      //   .limit(50) 
      //   .sort({ createdOn: -1 });

    /* Overall Stats */
    const overallStat = await OverallStat.find({ year: currentYear });

    
    const {
      totalCitizens,
      yearlyReportsTotal,
      yearlyReportsSolvedTotal,
      monthlyData,
      reportsByCategory,
    } = overallStat[0];

    

    const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
      return month === currentMonth;
    });

    const todayStats = overallStat[0].dailyData.find(({ date }) => {
      return date === currentDay;
    });

    res.status(200).json({
      totalCitizens,
      yearlyReportsSolvedTotal,
      yearlyReportsTotal,
      monthlyData,
      reportsByCategory,
      thisMonthStats,
      todayStats,
      // reports,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
