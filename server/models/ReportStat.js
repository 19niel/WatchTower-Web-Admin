import mongoose from "mongoose";

const ReportStatSchema = new mongoose.Schema(
  {
    productId: String,
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
  },
  { timestamps: true }
);

const ReportStat = mongoose.model("ReportStat", ReportStatSchema);
export default ReportStat;
