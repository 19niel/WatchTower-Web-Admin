import express from "express";
import {
  // Citizens
  getCitizens,
  addCitizen,
  deleteCitizen,
  updateCitizen,

  // Rescuers
  getRescuers,
  addRescuers,
  deleteRescuers,
  updateRescuers,

} from "../controllers/client.js";

const router = express.Router();




// Citizen CRUD
router.get("/citizens", getCitizens);
router.post("/citizens", addCitizen); 
router.delete("/citizens/:id", deleteCitizen); 
router.put("/citizens/:id", updateCitizen); 


// Rescuer CRUD
router.get("/rescuers", getRescuers);
router.post("/rescuers", addRescuers); 
router.delete("/rescuers/:id", deleteRescuers); 
router.put("/rescuers/:id", updateRescuers); 

export default router;
