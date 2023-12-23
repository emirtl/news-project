const User = require('../models/user');
const { register } = require('./auth');
const bcryptjs = require('bcryptjs');

jest.mock('../models/user');
jest.mock('bcryptjs');

describe('auth controller', () => {
    describe('register()', () => {
        it('should return an error if body is null', async () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'auth body is needed',
            });
        });

        it('should return an error if user already exists', async () => {
            const req = {
                body: {
                    username: 'test',
                    email: 'test@example.com',
                    password: 'password',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOne.mockResolvedValueOnce({
                email: 'test@example.com',
            });

            await register(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'user with thease credentials already exists',
            });
        });

        it('should hash password before creating model', async () => {
            const req = {
                body: {
                    username: 'test',
                    email: 'test@example.com',
                    password: 'password',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await User.findOne.mockResolvedValueOnce(null);

            bcryptjs.hash.mockReturnValueOnce('hashedPassword');

            await User.create.mockResolvedValueOnce({
                username: 'test',
                email: 'test@example.com',
                password: 'hashedPassword',
            });

            await register(req, res);
            expect(bcryptjs.hash).toHaveBeenCalledWith(req.body.password, 10);
        });
    });

    describe('login()', () => {});
});
