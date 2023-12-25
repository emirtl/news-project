const User = require('../models/user');
const { register, login } = require('./auth');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

afterEach(() => {
    jest.resetAllMocks();
});

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

    it('create user', async () => {
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

        const mockedUser = {
            username: 'test',
            email: 'test@example.com',
            password: 'hashedPassword',
        };

        await User.create.mockResolvedValueOnce(mockedUser);

        await bcryptjs.hash.mockReturnValueOnce('hashedPassword');

        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ user: mockedUser });
    });

    it('should handle unexpected errors', async () => {
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
        User.findOne.mockImplementation(() => {
            throw new Error('Unexpected error');
        });
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'user creation failed',
            e: new Error('Unexpected error'),
        });
    });

    describe('login()', () => {
        it('should check if request body is not empty', async () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'auth body is needed',
            });
        });

        it('should throw an error if user not found', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOne.mockResolvedValueOnce(null);

            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'user with thease credentials does not exist',
            });
        });

        it('should compare password before generating token', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOne.mockResolvedValueOnce({
                username: 'test',
                email: 'test@example.com',
                password: 'hashedPassword',
            });

            await login(req, res);

            expect(bcryptjs.compare).toHaveBeenCalledWith(
                req.body.password,
                'hashedPassword'
            );
        });

        it('should generate token', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const existedUser = {
                _id: '1234567890abcdef',
                email: 'test@example.com',
                password: 'hashedPassword',
                admin: false,
                owner: false,
            };

            User.findOne.mockResolvedValueOnce(existedUser);

            await bcryptjs.compare.mockResolvedValueOnce(true);

            jwt.sign.mockReturnValueOnce('mockToken');

            await login(req, res);

            const payload = {
                id: existedUser._id,
                email: existedUser.email,
                admin: existedUser.admin,
                owner: existedUser.owner,
            };

            expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.SECRET, {
                algorithm: 'HS256',
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
        });

        it('should handle unexpected errors', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOne.mockRejectedValue(new Error('unexpected error'));

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'loging user failed',
                e: new Error('unexpected error'),
            });
        });
    });
});
