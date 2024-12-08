import mongoose from "mongoose";

const RescuerSchema = new mongoose.Schema(
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
            required: false,
            max: 100,
            unique: true,
        },
        mobileNumber: {
            type: String,
            required: false,
            min: 11,
        },
        address: {
            type: String,
            required: false,
        },
        profileImage: {
            type: String,
            required: false,
        },
        reportsTaken: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report',
        }],
        role: {
            type: String,
            enum: ["rescuer", "admin"],
            default: "rescuer",
        },
        status: {
            type: String,
            enum: ["active", "offline", "occupied"],
            default: "active",
        }
    },
    { timestamps: true }
);

const Rescuer = mongoose.model('Rescuer', RescuerSchema);
export default Rescuer;
