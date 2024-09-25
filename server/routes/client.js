  import express from "express";
  import {

    // WatchTower
    getCitizens,
    getRescuers,
    addCitizen,
  } from "../controllers/client.js";

  const router = express.Router();



  router.get("/citizens", getCitizens);
  router.post("/citizens", addCitizen); // Adjust the route as needed

  router.get("/rescuers", getRescuers);

  export default router;
