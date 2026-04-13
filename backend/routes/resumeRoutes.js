const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getResumes } = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.use(authMiddleware);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);

module.exports = router;
