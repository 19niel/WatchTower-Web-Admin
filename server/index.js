import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';

// Grid FS
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";

// Data imports
import Rescuer from "./models/Rescuer.js";
import OverallStat from "./models/OverallStat.js";
import { dataOverallReportStatss, dataRescuer } from "./data/watchtowerdata.js";

// Import your routes
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import reportsRoutes from "./routes/reports.js";
import overallstatsRoutes from "./routes/overallstats.js";
import pendingReportsRoutes from "./routes/pendingReports.js"; // Import new pending reports route

// Load environment variables
dotenv.config();
const app = express();

// Grid FS setup
const mongoURI = process.env.MONGO_URL;

// Initialize GridFS stream
const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads"); // Collection to store files
});

const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: "uploads", // Matches the collection name in `gfs.collection`
        };
    },
});

const upload = multer({ storage }); // Initialize multer with GridFS storage

// Middleware
app.use(express.json({ limit: '10mb' })); // Set a higher limit for JSON requests
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// CORS configuration
app.use(cors({
  origin: 'https://watch-tower-web-admin.vercel.app', // Vercel client URL
  methods: 'GET,POST,PUT,DELETE', // Allow methods as needed
  allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
  credentials: true, // Allow cookies if necessary
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
app.use("/overallstats", overallstatsRoutes);
app.use("/reports", reportsRoutes);
app.use("/api/pending", pendingReportsRoutes); // Add new route here

// Upload route for single file upload using GridFS
app.post("/upload", upload.single("file"), (req, res) => {
    res.status(200).json({ file: req.file });
});

// AI Priority Route
app.post('/ai/priority', (req, res) => {
  const { disasterCategory, disasterInfo } = req.body;

  // Ensure disasterCategory and disasterInfo are provided
  if (!disasterCategory || !disasterInfo) {
    return res.status(400).json({ error: 'Missing disasterCategory or disasterInfo' });
  }

  // Specify the path to your priority_assigner.py script and virtual environment Python
  const pythonPath = path.join(__dirname, 'ai_model', 'venv', 'Scripts', 'python'); // Corrected for Linux environment
  const scriptPath = path.join(__dirname, 'ai_model', 'priority_assigner.py');

  console.log(`Executing Python script: ${scriptPath}`);
  console.log(`Using Python executable: ${pythonPath}`);
  
  // Execute the Python script
  exec(`"${pythonPath}" "${scriptPath}" "${disasterCategory}" "${disasterInfo}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'AI processing error' });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'AI processing error' });
    }

    const predictedPriority = stdout.trim(); // Assuming the prediction is just the priority string
    console.log(`Predicted priority: ${predictedPriority}`); // Log the prediction

    return res.json({ priority: predictedPriority });
  });
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

// Set the strictQuery option to suppress the deprecation warning
mongoose.set('strictQuery', false); // or true based on your needs

mongoose
    .connect(mongoURI)
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
        //OverallStat.insertMany(dataOverallReportStatss);
    })
    .catch((error) => console.log(`${error} did not connect`));


