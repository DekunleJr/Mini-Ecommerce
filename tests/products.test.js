// tests/products.test.js
const request = require('supertest');
const app = require('../app');
const sequelize = require('../util/database');
const Product = require('../models/products');
const User = require('../models/user');

let adminToken;

beforeAll(async () => {
  // Sync database
  await sequelize.sync({ force: true });

  // Create an admin user and get the token
  const adminResponse = await request(app).post('/users/signup').send({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpassword',
    isAdmin: true,
  });

  const loginResponse = await request(app).post('/users/login').send({
    email: 'admin@example.com',
    password: 'adminpassword',
  });

  adminToken = loginResponse.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product Management', () => {
  let productId;

  test('should create a new product (admin only)', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product',
        price: 100,
        description: 'A sample product',
        stock_quantity: 10,
        category: 'Electronics',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Test Product');

    productId = response.body.id;
  });

  test('should fetch all products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.statusCode).toBe(200);
    expect(response.body.products.length).toBeGreaterThan(0);
  });

  test('should fetch a single product by ID', async () => {
    const response = await request(app).get(`/api/products/${productId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', productId);
  });

  test('should update a product (admin only)', async () => {
    const response = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 150 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('price', 150);
  });

  test('should delete a product (admin only)', async () => {
    const response = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(204);
  });
});