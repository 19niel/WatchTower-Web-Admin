import express from "express";
import Report from "../models/Report.js";

const router = express.Router();

router.get("/reports/today", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of today
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today

    // Aggregation to count reports by category
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
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          disasterCategory: "$_id",
          count: 1,
        },
      },
    ]);

    // Initialize all categories with 0 counts
    const categoryCounts = {
      reportsByFloodToday: 0,
      reportsByFireToday: 0,
      reportsByTyphoonToday: 0,
      reportsByOthersToday: 0,
      totalReportsToday: 0,
    };

    // Map the aggregation results to categoryCounts
    reportsByCategory.forEach((category) => {
      if (category.disasterCategory === "Flood") {
        categoryCounts.reportsByFloodToday = category.count;
      } else if (category.disasterCategory === "Fire") {
        categoryCounts.reportsByFireToday = category.count;
      } else if (category.disasterCategory === "Typhoon") {
        categoryCounts.reportsByTyphoonToday = category.count;
      } else if (category.disasterCategory === "Others") {
        categoryCounts.reportsByOthersToday = category.count;
      }
      categoryCounts.totalReportsToday += category.count; // Total reports count
    });

    res.status(200).json(categoryCounts); // Return the category counts
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
