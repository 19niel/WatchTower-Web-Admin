import express from "express";
import Report from "../models/Report.js";

const router = express.Router();

router.get("/reports/today", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of today
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today

    // Aggregation to count reports by category and collect report _ids
    const reportsByCategory = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: "$disasterCategory", // Group by category
          count: { $sum: 1 }, // Count the number of reports in each category
          reportIds: { $push: "$_id" }, // Collect the _id of each report
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          disasterCategory: "$_id",
          count: 1,
          reportIds: 1,
        },
      },
    ]);

    // Initialize all categories with default values
    const categoryCounts = {
      reportsByFloodToday: { count: 0, reportIds: [] },
      reportsByFireToday: { count: 0, reportIds: [] },
      reportsByTyphoonToday: { count: 0, reportIds: [] },
      reportsByOthersToday: { count: 0, reportIds: [] },
      totalReportsToday: 0,
    };

    // Map the aggregation results to categoryCounts and collect report IDs
    reportsByCategory.forEach((category) => {
      if (category.disasterCategory === "Flood") {
        categoryCounts.reportsByFloodToday.count = category.count;
        categoryCounts.reportsByFloodToday.reportIds = category.reportIds;
      } else if (category.disasterCategory === "Fire") {
        categoryCounts.reportsByFireToday.count = category.count;
        categoryCounts.reportsByFireToday.reportIds = category.reportIds;
      } else if (category.disasterCategory === "Typhoon") {
        categoryCounts.reportsByTyphoonToday.count = category.count;
        categoryCounts.reportsByTyphoonToday.reportIds = category.reportIds;
      } else if (category.disasterCategory === "Others") {
        categoryCounts.reportsByOthersToday.count = category.count;
        categoryCounts.reportsByOthersToday.reportIds = category.reportIds;
      }
      categoryCounts.totalReportsToday += category.count; // Total reports count
    });

    res.status(200).json(categoryCounts); // Return the category counts and report IDs
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
