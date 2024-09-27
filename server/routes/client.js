import express from "express";
import {
  getCitizens,
  getRescuers,
  addCitizen,
  deleteCitizen,
  updateCitizen
} from "../controllers/client.js";

const router = express.Router();



router.get("/citizens", getCitizens);

// Updated POST route to remove multer middleware and expect JSON directly
router.post("/citizens", addCitizen); 
router.get("/rescuers", getRescuers);

// Delete Update route for citizens
router.delete("/citizens/:id", deleteCitizen); // <-- Add this line
router.put("/citizens/:id", updateCitizen); 

export default router;
