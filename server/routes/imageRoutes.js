import express from 'express';
import Grid from 'gridfs-stream';
import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// Create a connection to GridFS
const mongoURI = process.env.MONGO_URL;
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let gfs;

conn.once('open', () => {
    // Initialize stream
    gfs = Grid(conn.db, mongoose.mongo);
});

// Route to retrieve an image by filename
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }
        // Check if the file is an image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({ err: 'Not an image' });
        }
    });
});

// Route to get all images
router.get('/images', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({ err: 'No files exist' });
        }
        // Return files information without the files themselves
        return res.json(files);
    });
});

export default router;