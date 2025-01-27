// tests/users.test.js
const request = require('supertest');
const app = require('../app'); 
const sequelize = require('../util/database');
const User = require('../models/user');

beforeAll(async () => {
  try {
    await sequelize.authenticate(); // Ensure database connection works
    await sequelize.sync({ force: true }); // Sync database schema
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
});

afterAll(async () => {
  try {
    await sequelize.close(); // Properly close the database connection
  } catch (err) {
    console.error('Error closing the database connection:', err);
  }
});

describe('User Authentication', () => {
  test('should sign up a new user', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        isAdmin: true,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body).toHaveProperty('userId');
  });

  test('should not allow duplicate email signup', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email already in use');
  });

  test('should log in an existing user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('isAdmin', true);
  });

  test('should reject login with incorrect credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });
});
