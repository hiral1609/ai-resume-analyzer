const { analyzeResume } = require('../services/aiService');
const { query } = require('../config/db');

exports.runAnalysis = async (req, res) => {
  const { resumeId, jobDescription, domain } = req.body;

  try {
    // Fetch resume text
    const resumeResult = await query('SELECT extracted_text FROM resumes WHERE id = $1 AND user_id = $2', [resumeId, req.user.id]);
    if (resumeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    const resumeText = resumeResult.rows[0].extracted_text;

    // Save job description
    const jobResult = await query('INSERT INTO jobs (description_text) VALUES ($1) RETURNING id', [jobDescription]);
    const jobId = jobResult.rows[0].id;

    // AI Analysis
    const analysisResults = await analyzeResume(resumeText, jobDescription, domain);

    // Save analysis
    const result = await query(
      `INSERT INTO analysis 
      (user_id, resume_id, job_id, match_score, domain, missing_skills, suggestions, strengths, weaknesses, ats_check, suggested_projects, section_feedback) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        req.user.id, 
        resumeId, 
        jobId, 
        analysisResults.match_score,
        domain || 'General',
        JSON.stringify(analysisResults.missing_skills),
        JSON.stringify(analysisResults.suggestions),
        JSON.stringify(analysisResults.strengths),
        JSON.stringify(analysisResults.weaknesses),
        JSON.stringify({ 
          ats_compatibility_score: analysisResults.ats_compatibility_score,
          improvement_tips: analysisResults.improvement_tips,
          semantic_summary: analysisResults.semantic_summary
        }),
        JSON.stringify(analysisResults.suggested_projects),
        JSON.stringify(analysisResults.section_feedback)
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error performing analysis' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, r.file_url as resume_url, j.description_text as job_description 
       FROM analysis a
       JOIN resumes r ON a.resume_id = r.id
       JOIN jobs j ON a.job_id = j.id
       WHERE a.user_id = $1 
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching history' });
  }
};

exports.getReport = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      `SELECT a.*, r.file_url, j.description_text 
       FROM analysis a
       JOIN resumes r ON a.resume_id = r.id
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching report' });
  }
};
