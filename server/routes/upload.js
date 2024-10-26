// server/routes/upload.js
const express = require('express');
const { upload } = require('../grid');
const router = express.Router();

// Handle file upload
router.post('/upload', upload.array('disasterImages', 10), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const fileIds = req.files.map(file => file.id); // Get uploaded file IDs
  res.status(200).json({ fileIds });
});

module.exports = router;
