const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB, clearDB } = require('./db');

let adminToken, userToken, sweetId;

describe('Inventory Endpoints', () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
    // Register admin
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin', email: 'admin@example.com', password: 'AdminPass', role: 'admin' });
    // Register user
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'User', email: 'user@example.com', password: 'UserPass', role: 'user' });
    // Login admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'AdminPass' });
    adminToken = adminRes.body.token;
    // Login user
    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'UserPass' });
    userToken = userRes.body.token;
    // Add a sweet as admin
    const sweetRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ladoo', category: 'Indian', price: 10, quantity: 100 });
    sweetId = sweetRes.body.sweet._id;
  });

  it('should allow user to purchase sweet and reduce stock', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.sweet.quantity).toBe(95);
  });

  it('should not allow purchase if stock is insufficient', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 200 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should allow admin to restock sweet', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 50 });
    expect(res.statusCode).toBe(200);
    expect(res.body.sweet.quantity).toBe(150);
  });

  it('should not allow non-admin to restock sweet', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 50 });
    expect(res.statusCode).toBe(403);
  });

  afterAll(async () => {
    await disconnectDB();
  });
});
