import OverallStat from "../models/OverallStat.js";

export const getReports = async (req, res) => {
  try {
    const overallStats = await OverallStat.find();

    res.status(200).json(overallStats[0]); // first array is 2023
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
