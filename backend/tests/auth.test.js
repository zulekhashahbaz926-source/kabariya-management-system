const request = require('supertest');
const app = require('../server');
const { run } = require('../src/config/db');

describe('🔑 Authentication System Integration Tests', () => {
  const testUser = {
    username: 'teststudent',
    email: 'student@university.edu',
    password: 'securepassword123'
  };

  beforeAll(async () => {
    // Clear test user if already exists
    await run('DELETE FROM users WHERE email = ? OR username = ?', [testUser.email, testUser.username]);
  });

  afterAll(async () => {
    await run('DELETE FROM users WHERE email = ?', [testUser.email]);
  });

  test('✅ POST /api/auth/signup - Should register a new student user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe(testUser.username);
    expect(res.body.user.role).toBe('student');
  });

  test('❌ POST /api/auth/signup - Should fail to register duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errorType).toBe('DATABASE_CONSTRAINT');
  });

  test('✅ POST /api/auth/login - Should authenticate and return a JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('❌ POST /api/auth/login - Should reject incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid credentials');
  });

  test('✅ GET /api/auth/profile - Should retrieve profile using JWT authorization header', async () => {
    // 1. Log in to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    const token = loginRes.body.token;

    // 2. Query profile with token
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.username).toBe(testUser.username);
  });
});
