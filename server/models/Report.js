import mongoose from "mongoose";
const { Schema } = mongoose;
const ReportSchema = new mongoose.Schema(
    {
        reporterId: {
            type: Schema.Types.ObjectId,
            ref: 'Citizen', // Reference to Citizen collection
            required: true
        },
        location: {
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        disasterType: {
            type: String,
            required: true
        },
        disasterImage: {
            type: String,
        },
        disasterInfo: {
            type: String,
            required: true,
            min: 5,
        },
        disasterStatus: {
                type: String,
                enum: ["Active","Pending", "In Progress", "Solved", "Failed", "Under Review", "Completed", ],
                default: "Pending"
        },
        rescuerId: {
            type: Schema.Types.ObjectId,
            ref: 'Rescuer', // Reference to Rescuer collection
            required: false
        },
        isVerified:{
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);


const Report = mongoose.model("Report", ReportSchema);
export default Report;