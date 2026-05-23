const request = require('supertest');
const app = require('../server');
const { run, get } = require('../src/config/db');

describe('🤖 AI Quiz Generator Integration Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // 1. Create a fresh test student
    const username = 'quizstudent';
    const email = 'quizstudent@university.edu';
    const password = 'quizpassword';

    await run('DELETE FROM users WHERE email = ?', [email]);

    const registerRes = await request(app)
      .post('/api/auth/signup')
      .send({ username, email, password });

    token = registerRes.body.token;
    userId = registerRes.body.user.id;
  });

  afterAll(async () => {
    await run('DELETE FROM users WHERE id = ?', [userId]);
    await run('DELETE FROM quizzes WHERE user_id = ?', [userId]);
  });

  test('❌ POST /api/ai/quiz - Should reject requests lacking a topic', async () => {
    const res = await request(app)
      .post('/api/ai/quiz')
      .set('Authorization', `Bearer ${token}`)
      .send({}); // No topic

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errorType).toBe('VALIDATION_ERROR');
  });

  test('✅ POST /api/ai/quiz - Should generate quiz for SOLID Principles', async () => {
    const res = await request(app)
      .post('/api/ai/quiz')
      .set('Authorization', `Bearer ${token}`)
      .send({
        topic: 'solid',
        courseId: 1
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.quizId).toBeDefined();
    expect(res.body.topic).toBe('SOLID Principles');
    expect(res.body.questions).toHaveLength(2);
    
    // Check first question format
    const q1 = res.body.questions[0];
    expect(q1.question).toContain('SOLID principle');
    expect(q1.options).toBeDefined();
    expect(q1.answer).toBeDefined();
    expect(q1.explanation).toBeDefined();

    // Verify quiz persisted in DB
    const dbQuiz = await get('SELECT * FROM quizzes WHERE id = ?', [res.body.quizId]);
    expect(dbQuiz).toBeDefined();
    expect(dbQuiz.topic).toBe('SOLID Principles');
    expect(JSON.parse(dbQuiz.questions)).toHaveLength(2);
  });
});
