import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Utility to get the current directory (ESM-compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Define the path to the Python script
const pythonScriptPath = join(__dirname, 'priority_assigner.py');

// Define the arguments to pass to the Python script
const disasterCategory = 'Flood';
const disasterInfo = '2 people stuck on the roof need emergency';

// Spawn a new process to run the Python script
const pythonProcess = spawn('python', [pythonScriptPath, disasterCategory, disasterInfo]);

// Listen for data output from the Python script
pythonProcess.stdout.on('data', (data) => {
    console.log(`Predicted Priority: ${data}`);
});

// Listen for errors
pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
});

// Handle process exit
pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
});
