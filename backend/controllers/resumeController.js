const { extractText, cleanText } = require('../services/textExtractionService');
const { query } = require('../config/db');
const path = require('path');

const isResumeValid = (text) => {
  const keywords = ['education', 'experience', 'skills', 'project', 'university', 'college', 'degree', 'work', 'profile', 'summary', 'certification', 'technologies', 'achievement'];
  const lowerText = text.toLowerCase();
  const matchCount = keywords.filter(kw => lowerText.includes(kw)).length;
  // Require at least 3 common resume keywords to be considered a valid resume
  return matchCount >= 3;
};

exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a resume file' });
  }

  try {
    const extractedText = await extractText(req.file.path, req.file.mimetype);
    const cleanedText = cleanText(extractedText);

    if (!cleanedText || cleanedText.trim() === '') {
       return res.status(400).json({ message: 'Could not extract text from the document. Please upload a valid readable PDF or DOCX.' });
    }

    if (!isResumeValid(cleanedText)) {
      return res.status(400).json({ message: 'Invalid document detected. Please upload a valid resume PDF or DOCX file.' });
    }

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
