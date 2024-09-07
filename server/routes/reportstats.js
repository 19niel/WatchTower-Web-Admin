import express from "express";
import { getReportStats } from "../controllers/reportstats.js";

const router = express.Router();

router.get("/reportStats", getReportStats);

export default router;
