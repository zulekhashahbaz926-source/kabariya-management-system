const request = require('supertest');
const app = require('../server');
const { run, get } = require('../src/config/db');

describe('🛒 Simulated Payment & Course Purchase Tests', () => {
  let token;
  let userId;
  const courseId = 1; // Seeded course ID

  beforeAll(async () => {
    // 1. Create a fresh test student
    const username = 'buyerstudent';
    const email = 'buyer@university.edu';
    const password = 'buyerpassword';
    
    await run('DELETE FROM users WHERE email = ?', [email]);
    await run('DELETE FROM enrollments WHERE course_id = ?', [courseId]);

    const registerRes = await request(app)
      .post('/api/auth/signup')
      .send({ username, email, password });

    token = registerRes.body.token;
    userId = registerRes.body.user.id;
  });

  afterAll(async () => {
    await run('DELETE FROM users WHERE id = ?', [userId]);
    await run('DELETE FROM enrollments WHERE user_id = ?', [userId]);
  });

  test('❌ POST /api/courses/purchase - Should fail for card format length errors', async () => {
    const res = await request(app)
      .post('/api/courses/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseId: courseId,
        cardNumber: '1234' // Too short
      });

    expect(res.status).toBe(402);
    expect(res.body.success).toBe(false);
    expect(res.body.errorType).toBe('PAYMENT_REQUIRED');
    expect(res.body.message).toContain('Declined: Invalid credit card');
  });

  test('❌ POST /api/courses/purchase - Should fail with insufficient funds error on card starting with 4002', async () => {
    const res = await request(app)
      .post('/api/courses/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseId: courseId,
        cardNumber: '4002 0000 0000 0000' // Triggers mock insufficient funds
      });

    expect(res.status).toBe(402);
    expect(res.body.success).toBe(false);
    expect(res.body.errorType).toBe('PAYMENT_REQUIRED');
    expect(res.body.message).toContain('Insufficient funds');
  });

  test('✅ POST /api/courses/purchase - Should purchase course successfully with discount coupon', async () => {
    const res = await request(app)
      .post('/api/courses/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseId: courseId,
        cardNumber: '4242 4242 4242 4242', // Valid mock card
        couponCode: 'STUDENT50'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.transaction).toBeDefined();
    expect(res.body.transaction.amountPaid).toBe(39.99); // 50% of 79.99 (discounted course price)

    // Verify enrollment recorded in DB
    const enrollment = await get('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, courseId]);
    expect(enrollment).toBeDefined();
    expect(enrollment.progress).toBe(0);
  });

  test('❌ POST /api/courses/purchase - Should reject duplicate purchase attempts', async () => {
    const res = await request(app)
      .post('/api/courses/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        courseId: courseId,
        cardNumber: '4242 4242 4242 4242'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already enrolled');
  });
});
