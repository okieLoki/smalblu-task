const request = require('supertest');
const app = require('./app');

describe('User Testing', () => {

    beforeAll(async () => {
        await request(app)
            .post('/api/user/register')
            .send({ email: 'test@example.com', password: 'password123' });
    })

    it('should log in an existing user', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Login successful');
        expect(response.body.token).toBeDefined();
    });

    it('should fail to log in with incorrect credentials', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({ email: 'test@example.com', password: 'incorrectpassword' });

        expect(response.status).toBe(500);
        expect(response.body.status).toBe('Failed');
        expect(response.body.message).toBe('Username/password not valid');
    });

    it('should fail to log in with missing credentials', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({ email: 'test@example.com' });

        expect(response.status).toBe(500);
        expect(response.body.status).toBe('Failed');
        expect(response.body.message).toBe('Email or Password Missing');
    });

    it('should delete the user', async () => {
        const response = await request(app)
            .delete('/api/user/delete')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('User deleted');
    });
});

describe('Currency Testing', () => {
    let agent

    beforeAll(async () => {
        agent = request.agent(app);

        await agent
            .post('/api/user/register')
            .send({ email: 'test@example.com', password: 'password123' });

        await agent
            .post('/api/user/login')
            .send({ email: 'test@example.com', password: 'password123' });
    });

    it('should convert currency', async () => {
        const response = await agent
            .get('/api/currency/convert?from=USD&to=EUR&amount=1');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.from).toBe('USD');
        expect(response.body.data.to).toBe('EUR');
        expect(response.body.data.amount).toBe(1);
        expect(response.body.data.rate).toBeDefined();
        expect(response.body.data.date).toBeDefined();
        expect(response.body.data.result).toBeDefined();
    });

    it('should fetch live exchange rates', async () => {
        const response = await agent
            .get('/api/currency/live?base=USD&symbols=EUR,GBP');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.base).toBe('USD');
        expect(response.body.data.rates).toBeDefined();
    });

    it('should fetch historical exchange rates', async () => {
        const response = await agent
            .get('/api/currency/historical?from=USD&to=EUR');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });

    afterAll(async () => {
        await agent
            .delete('/api/user/delete')
            .send({ email: 'test@example.com', password: 'password123' });
    });
});