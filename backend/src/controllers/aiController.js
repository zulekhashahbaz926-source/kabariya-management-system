const { run, query } = require('../config/db');
const aiService = require('../services/aiService');

const chatTutor = async (req, res, next) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    if (!message) {
      const error = new Error('Message content is required.');
      error.name = 'ValidationError';
      throw error;
    }

    // 1. Get Simulated Response
    const aiResponse = await aiService.getChatResponse(message);

    // 2. Save dialogue to chat history database
    await run(
      'INSERT INTO chat_history (user_id, message, response) VALUES (?, ?, ?)',
      [userId, message, aiResponse]
    );

    res.status(200).json({
      success: true,
      response: aiResponse
    });
  } catch (err) {
    next(err);
  }
};

const getChatHistory = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const history = await query(
      'SELECT message, response, created_at FROM chat_history WHERE user_id = ? ORDER BY created_at ASC',
      [userId]
    );

    res.status(200).json({
      success: true,
      history
    });
  } catch (err) {
    next(err);
  }
};

const createQuiz = async (req, res, next) => {
  const { topic, courseId } = req.body;
  const userId = req.user.id;

  try {
    if (!topic) {
      const error = new Error('Topic query is required to generate quiz.');
      error.name = 'ValidationError';
      throw error;
    }

    // Generate questions using AI simulation
    const quizData = await aiService.generateQuiz(topic);

    // Save quiz to DB
    const result = await run(`
      INSERT INTO quizzes (user_id, course_id, topic, questions)
      VALUES (?, ?, ?, ?)
    `, [userId, courseId || null, quizData.topic, JSON.stringify(quizData.questions)]);

    res.status(201).json({
      success: true,
      quizId: result.id,
      topic: quizData.topic,
      questions: quizData.questions
    });
  } catch (err) {
    next(err);
  }
};

const summarizeContent = async (req, res, next) => {
  const { content } = req.body;
  try {
    if (!content) {
      const error = new Error('Text content is required for AI summarization.');
      error.name = 'ValidationError';
      throw error;
    }

    const summary = await aiService.generateSummary(content);

    res.status(200).json({
      success: true,
      summary
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  chatTutor,
  getChatHistory,
  createQuiz,
  summarizeContent
};
