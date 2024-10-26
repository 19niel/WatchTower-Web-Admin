import mongoose from 'mongoose'; // Change to import
import { GridFsStorage } from 'multer-gridfs-storage'; // Change to import
import multer from 'multer'; // Change to import
import dotenv from "dotenv";

dotenv.config();

// Create a MongoDB connection
const mongoURI = process.env.MONGO_URL; // Ensure you have MONGO_URL in your .env file

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${file.fieldname}-${Date.now()}`, // Filename format
      bucketName: 'uploads', // Collection name in GridFS
    };
  },
});

const upload = multer({ storage });

// Export using ES Modules syntax
export { upload }; 
