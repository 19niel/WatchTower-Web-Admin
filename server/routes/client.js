import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,


  // WatchTower
  getCitizens,
  getRescuers
  //getUser,
} from "../controllers/client.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);

// router.get("/users", getUsers);

router.get("/citizens", getCitizens);
router.get("/rescuers", getRescuers);

export default router;
