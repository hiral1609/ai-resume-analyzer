const express = require('express');
const router = express.Router();
const { runAnalysis, getHistory, getReport } = require('../controllers/analysisController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/run', runAnalysis);
router.get('/history', getHistory);
router.get('/report/:id', getReport);

module.exports = router;
