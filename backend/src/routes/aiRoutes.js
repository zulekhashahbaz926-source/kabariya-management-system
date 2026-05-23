const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  chatTutor,
  getChatHistory,
  createQuiz,
  summarizeContent
} = require('../controllers/aiController');

router.post('/chat', verifyToken, chatTutor);
router.get('/chat/history', verifyToken, getChatHistory);
router.post('/quiz', verifyToken, createQuiz);
router.post('/summarize', verifyToken, summarizeContent);

module.exports = router;
