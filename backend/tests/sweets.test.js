const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB, clearDB } = require('./db');

let adminToken, userToken, sweetId;

describe('Sweets Endpoints', () => {
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

    // Add a sweet as admin for list/search/update/delete tests
    const sweetRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ladoo', category: 'Indian', price: 10, quantity: 100 });
    sweetId = sweetRes.body.sweet._id;
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('should not allow non-admin to add sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Ladoo', category: 'Indian', price: 10, quantity: 100 });
    expect(res.statusCode).toBe(403);
  });

  it('should allow admin to add sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Ladoo', category: 'Indian', price: 10, quantity: 100 });
    expect(res.statusCode).toBe(201);
    expect(res.body.sweet).toHaveProperty('name', 'Ladoo');
    sweetId = res.body.sweet._id;
  });

  it('should list all sweets', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.sweets)).toBe(true);
    expect(res.body.sweets.length).toBeGreaterThan(0);
  });

  it('should search sweets by name', async () => {
    const res = await request(app)
      .get('/api/sweets/search?name=Ladoo')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.sweets[0]).toHaveProperty('name', 'Ladoo');
  });

  it('should update sweet (admin only)', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 12 });
    expect(res.statusCode).toBe(200);
    expect(res.body.sweet).toHaveProperty('price', 12);
  });

  it('should not allow non-admin to update sweet', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 15 });
    expect(res.statusCode).toBe(403);
  });

  it('should delete sweet (admin only)', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should not allow non-admin to delete sweet', async () => {
    // Add sweet as admin
    const addRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Barfi', category: 'Indian', price: 20, quantity: 50 });
    const barfiId = addRes.body.sweet._id;
    // Try delete as user
    const res = await request(app)
      .delete(`/api/sweets/${barfiId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  afterAll(async () => {
    await disconnectDB();
  });
});
