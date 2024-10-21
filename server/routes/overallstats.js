import express from "express";
import { getOverallStats} from "../controllers/overallstats.js";

const router = express.Router();

router.get("/", getOverallStats);

export default router;
