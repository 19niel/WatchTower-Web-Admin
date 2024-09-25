import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer"; // Import multer for file uploads
import path from "path";
import { fileURLToPath } from 'url'; // Import for getting __filename
import { dirname } from 'path'; // Import for getting __dirname
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import reportsRoutes from "./routes/reports.js";

// Load environment variables
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Getting __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files (e.g., for serving uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* MULTER CONFIGURATION */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Images will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter
});

/* ROUTES */
app.use("/client", clientRoutes); // Include the client routes here
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
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
