const { extractText, cleanText } = require('../services/textExtractionService');
const { query } = require('../config/db');
const path = require('path');

exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a resume file' });
  }

  try {
    const extractedText = await extractText(req.file.path, req.file.mimetype);
    const cleanedText = cleanText(extractedText);

    const result = await query(
      'INSERT INTO resumes (user_id, file_url, extracted_text) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, req.file.path, cleanedText]
    );

    res.status(201).json({
      message: 'Resume uploaded and processed successfully',
      resume: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing resume' });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const result = await query('SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching resumes' });
  }
};
