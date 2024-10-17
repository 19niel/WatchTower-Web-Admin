import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// data imports

import Rescuer from "./models/Rescuer.js";
import OverallStat from "./models/OverallStat.js";
import {
  dataRescuer,
} from "./data/watchtowerdata.js";

// Import your routes
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import reportsRoutes from "./routes/reports.js";

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Set a higher limit for JSON requests
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Allow your React app's origin
    credentials: true // Allow credentials if needed
}));

// Getting __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files (e.g., for serving uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ROUTES */
app.use("/client", clientRoutes); // Include the client routes here
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);
app.use("/reports", reportsRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
        /* ONLY ADD DATA ONE TIME */
        // AffiliateStat.insertMany(dataAffiliateStat);
        // Product.insertMany(dataProduct);
        // ProductStat.insertMany(dataProductStat);
        // Transaction.insertMany(dataTransaction);
        
        // WatchTower Files
        // User.insertMany(dataUser);
        // Citizen.insertMany(dataCitizen);
        // Rescuer.insertMany(dataRescuer);
        // Admin.insertMany(dataAdmin);
        // OverallStat.insertMany(dataOverallReportStat);
    })
    .catch((error) => console.log(`${error} did not connect`));
