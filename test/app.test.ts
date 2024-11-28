import request from 'supertest';
import app from '../src/app';

describe('Program Recommendations', () => {
  it('GET /programs/isolated-residents should return a list of program names', async () => {
    const response = await request(app)
      .get('/programs/isolated-residents')
      .expect(200)
      .expect('Content-Type', /json/)
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
  });
  it('GET /programs/isolated-residents should throw error when invalid date', async () => {
    await request(app)
      .get('/programs/isolated-residents?fromDate=')
      .expect(400)
      .expect('Content-Type', /json/)
  });
});
