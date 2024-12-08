import express from "express";
import Report from "../models/Report.js"; // Ensure this points to your Report model

const router = express.Router();

router.get("/reports/today", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of today
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today

    const reportsTodayCount = await Report.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    res.status(200).json({ reportsTodayCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
