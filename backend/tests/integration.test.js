const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Property = require('../models/Property');

describe('API Integration Tests', () => {
  let token;
  let testUser;
  let testProperty;

  beforeAll(async () => {
    // Conectar a la base de datos de prueba
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    
    // Crear usuario de prueba
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '123456789'
    });

    // Obtener token de autenticación
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    token = loginResponse.body.token;
  });

  afterAll(async () => {
    // Limpiar base de datos
    await User.deleteMany({});
    await Property.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Property Endpoints', () => {
    it('should create a new property', async () => {
      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Property',
          type: 'house',
          price: 100,
          description: 'Test description',
          rooms: 2,
          bathrooms: 1,
          area: 100,
          district: 'Test District',
          province: 'Test Province'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      testProperty = response.body;
    });

    it('should get all properties', async () => {
      const response = await request(app)
        .get('/api/properties');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get property by id', async () => {
      const response = await request(app)
        .get(`/api/properties/${testProperty._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', testProperty._id);
    });
  });

  describe('User Endpoints', () => {
    it('should get user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          phone: '987654321'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
    });
  });
}); 