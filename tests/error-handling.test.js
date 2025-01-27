
const request = require('supertest');
const app = require('../app');
const sequelize = require('../util/database');

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

describe('Error Handling', () => {
  test('should return 401 for unauthorized access to protected route', async () => {
    const response = await request(app).post('/api/products').send({
      name: 'Unauthorized Product',
      price: 50,
      description: 'Unauthorized access',
      stock_quantity: 5,
      category: 'Unauthorized',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Not authenticated.');
  });

  test('should return 403 for non-admin user trying to create a product', async () => {
    const nonAdminResponse = await request(app).post('/users/signup').send({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'userpassword',
    });

    const nonAdminLogin = await request(app).post('/users/login').send({
      email: 'user@example.com',
      password: 'userpassword',
    });

    const nonAdminToken = nonAdminLogin.body.token;

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({
        name: 'Unauthorized Product',
        price: 50,
        description: 'Unauthorized access',
        stock_quantity: 5,
        category: 'Unauthorized',
      });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('message', 'Access denied. Admins only.');
  });

  test('should return 404 for invalid product ID', async () => {
    const response = await request(app).get('/api/products/9999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Product not found');
  });

  test('should return 400 for invalid query parameters', async () => {
    const response = await request(app).get('/api/products?page=-1&limit=abc');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid query parameters');
  });
});
