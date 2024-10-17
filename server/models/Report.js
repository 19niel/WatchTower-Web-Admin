import mongoose from "mongoose";
const { Schema } = mongoose;
const ReportSchema = new mongoose.Schema(
    {
        reporterId: {
            type: Schema.Types.ObjectId,
            ref: 'Citizen', // Reference to Citizen collection
            required: true
        },
        reportedBy:{ // The Full Name of the Reporter
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        disasterCategory: {
            type: String,
            enum: ["Flood", "Typhoon",  "Fire", "Animals", "Casualties","Others","Structural_Damage" ],
            default: "Others",
            required: true
        },
        disasterImage: {
            type: [String], // Array of strings (URLs or file paths)
            default: [], // Default to an empty array if no images are uploaded
        },
        disasterInfo: {
            type: String,
            required: true,
            min: 5,
        },
        disasterStatus: {
                type: String,
                enum: ["Active", "In Progress", "Solved", "Failed", "Under Review", "Completed", ],
                default: "Under Review"
        },
        rescuerId: {
            type: Schema.Types.ObjectId,
            ref: 'Rescuer', // Reference to Rescuer collection
            required: false
        },
        rescuerName: {
            type: Schema.Types.ObjectId,
            ref: 'Rescuer', // Reference to Rescuer collection
            required: false
        },
    },
    { timestamps: true }
);


const Report = mongoose.model("Report", ReportSchema);
export default Report;