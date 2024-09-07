import mongoose from "mongoose";

const OverallStatSchema = new mongoose.Schema(
  {
    totalCitizens: Number,
    yearlyReportsTotal: Number,
    yearlyReportsSolvedTotal: Number,
    year: Number,
    monthlyData: [
      {
        month: String,
        totalReports: Number,
        totalReportsSolved: Number,
      },
    ],
    dailyData: [
      {
        date: String,
        totalReports: Number,
        totalReportsSolved: Number,
      },
    ],
    reportsByCategory: {
      type: Map,
      of: Number,
    },
  },
  { timestamps: true }
);

const OverallStat = mongoose.model("OverallStat", OverallStatSchema);
export default OverallStat;
