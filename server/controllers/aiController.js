import { spawn } from 'child_process';
import path from 'path';

export const getPriority = async (req, res) => {
    try {
        const { disasterCategory, disasterInfo } = req.body;

        if (!disasterCategory || !disasterInfo) {
            return res.status(400).json({ error: "Both disasterCategory and disasterInfo are required." });
        }

        const pythonScriptPath = path.join(__dirname, '../ai_model/priority_assigner.py');
        
        // Spawn Python process
        const pythonProcess = spawn('python', [pythonScriptPath, disasterCategory, disasterInfo]);

        let result = '';

        // Collect output from Python script
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        // Handle Python process completion
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                res.status(200).json({ priority: result.trim() });
            } else {
                res.status(500).json({ error: "Failed to process AI model" });
            }
        });

        // Handle Python errors
        pythonProcess.stderr.on('data', (error) => {
            console.error("Python Error:", error.toString());
            res.status(500).json({ error: "Error from AI model" });
        });

    } catch (error) {
        console.error("Error in getPriority:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
