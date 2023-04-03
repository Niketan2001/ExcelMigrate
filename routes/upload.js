const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');

const uploadService = require('../services/uploadService');
const excelCheck = require('../services/excelCheck');

const router = express.Router();
const upload = multer();

// Define an endpoint to handle file uploads
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const sheetName = req.body.sheetName || 'Sheet1'; // Use 'Sheet1' if sheetName is not provided
    const workbook = xlsx.read(req.file.buffer);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    await excelCheck.checkRepeatedData(data);
    await uploadService.uploadData(data);

    res.send('File uploaded successfully');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
