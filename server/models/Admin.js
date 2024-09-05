import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        username: {
            type: String,
            required: true,
            max: 100,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        email: {
            type: String,
            required: true,
            max: 100,
            unique: true,
        },
        mobileNumber: {
            type: String,
            required: false,
            min: 11,
        },
        address: {
            barangay: { type: String },
            street: { type: String },
            houseNumber: { type: String },
        },
        profileImage: {
            type: String, // Store Base64-encoded image as a string
            required: false, // Set to true if you want to make it mandatory
        },
        reports: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report', // Assuming you have a Report model
        }],
        role: {
            type: String,
            enum: ["admin", "superadmin"],
            default: "admin",
        },
        status: {
            type: String,
            enum: ["active", "offline"],
            default: "offline",
        }
    },
    { timestamps: true }
);

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;