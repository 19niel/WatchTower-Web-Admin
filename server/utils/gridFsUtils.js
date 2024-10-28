import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gfsBucket;

mongoose.connection.on('connected', () => {
    const db = mongoose.connection.db;
    gfsBucket = new GridFSBucket(db, {
        bucketName: 'uploads'
    });
});

export const getGfsBucket = () => gfsBucket;
