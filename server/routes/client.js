import express from "express";
import {

  getCustomers,
  getGeography,

  // WatchTower
  getCitizens,
  getRescuers,
  createCitizen,
} from "../controllers/client.js";

const router = express.Router();


router.get("/customers", getCustomers);
router.get("/geography", getGeography);


router.get("/citizens", getCitizens);
router.post("/citizens", createCitizen); // Adjust the route as needed


router.get("/rescuers", getRescuers);

export default router;
