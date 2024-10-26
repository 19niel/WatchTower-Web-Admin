import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Grid from 'gridfs-stream'; // Import GridFS
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage'; // Corrected import

// Data imports
import Rescuer from "./models/Rescuer.js";
import { dataRescuer } from "./data/watchtowerdata.js";

// Import your routes
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import reportsRoutes from "./routes/reports.js";
import overallstatsRoutes from "./routes/overallstats.js";
import imageRoutes from "./routes/imageRoutes.js"; // Import the image routes


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

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

// Set the strictQuery option to suppress the deprecation warning
mongoose.set('strictQuery', false); // or true based on your needs

// Create connection for GridFS
const mongoURI = process.env.MONGO_URL; // MongoDB URI
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let gfs;

conn.once('open', () => {
    // Initialize stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // Set the collection name
});

// Create storage engine for multer
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads', // Set the name of the collection to store the images
        };
    },
});

const upload = multer({ storage });

// Image upload route
app.post('/api/images/upload', upload.array('images', 10), (req, res) => {
    res.status(200).json({ file: req.files }); // Respond with uploaded file info
});

/* ROUTES */
app.use("/client", clientRoutes); // Include the client routes here
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/overallstats", overallstatsRoutes);
app.use("/reports", reportsRoutes);

mongoose
    .connect(mongoURI, {
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