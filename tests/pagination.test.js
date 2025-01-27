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

  // Add sample products
  await Product.bulkCreate([
    { name: 'Product A', price: 50, description: 'Description A', stock_quantity: 20, category: 'Category 1' },
    { name: 'Product B', price: 100, description: 'Description B', stock_quantity: 15, category: 'Category 2' },
    { name: 'Product C', price: 150, description: 'Description C', stock_quantity: 10, category: 'Category 1' },
    { name: 'Product D', price: 200, description: 'Description D', stock_quantity: 5, category: 'Category 3' },
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product Management - Advanced Features', () => {
  test('should implement pagination for product listing', async () => {
    const response = await request(app).get('/api/products?page=1&limit=2');
    expect(response.statusCode).toBe(200);
    expect(response.body.products.length).toBe(2);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('totalPages');
  });

  test('should search products by name (partial match)', async () => {
    const response = await request(app).get('/api/products?search=Product');
    expect(response.statusCode).toBe(200);
    expect(response.body.products.length).toBeGreaterThan(0);
    expect(response.body.products[0].name).toContain('Product');
  });

  test('should filter products by category', async () => {
    const response = await request(app).get('/api/products?category=Category 1');
    expect(response.statusCode).toBe(200);
    expect(response.body.products.every((product) => product.category === 'Category 1')).toBe(true);
  });

  test('should filter products by price range', async () => {
    const response = await request(app).get('/api/products?minPrice=50&maxPrice=150');
    expect(response.statusCode).toBe(200);
    expect(response.body.products.every((product) => product.price >= 50 && product.price <= 150)).toBe(true);
  });

  test('should sort products by price in ascending order', async () => {
    const response = await request(app).get('/api/products?sortBy=price&order=ASC');
    expect(response.statusCode).toBe(200);
    const prices = response.body.products.map((product) => product.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('should sort products by name in descending order', async () => {
    const response = await request(app).get('/api/products?sortBy=name&order=DESC');
    expect(response.statusCode).toBe(200);
    const names = response.body.products.map((product) => product.name);
    expect(names).toEqual([...names].sort().reverse());
  });

  test('should sort products by stock quantity in ascending order', async () => {
    const response = await request(app).get('/api/products?sortBy=stock_quantity&order=ASC');
    expect(response.statusCode).toBe(200);
    const stockQuantities = response.body.products.map((product) => product.stock_quantity);
    expect(stockQuantities).toEqual([...stockQuantities].sort((a, b) => a - b));
  });
});
