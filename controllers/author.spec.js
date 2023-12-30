const author = require('../models/author');
const Author = require('../models/author');
const { getAll, insert, update, delete: remove } = require('./author');

jest.mock('../models/author');

const mockedAuthor = {
    name: 'andrew white',
    position: 'senior editor',
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled`,
};

describe('author controller', () => {
    describe('getAll()', () => {
        it('should return all authors', async () => {
            const req = {
                body: {},
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            await Author.find.mockResolvedValueOnce([mockedAuthor]);
            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ authors: [mockedAuthor] });
        });

        it('should throw an error if authors cant be reached', async () => {
            const req = {
                body: {},
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            await Author.find.mockResolvedValueOnce(null);
            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'fetching authors failed',
            });
        });

        it('should handle unexpected error', async () => {
            const req = {
                body: {},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await Author.find.mockRejectedValueOnce(
                new Error('unexpected error')
            );
            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'fetching authors failed',
                e: new Error('unexpected error'),
            });
        });
    });
    describe('insert()', () => {
        it('should throw an error if body is empty', async () => {
            const req = {
                body: {},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await insert(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'author body is needed',
            });
        });

        it('should create author', async () => {
            const req = {
                body: { ...mockedAuthor },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            Author.create.mockResolvedValueOnce(mockedAuthor);
            await insert(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                author: mockedAuthor,
            });
        });

        it('should throw an error if creating author failed', async () => {
            const req = {
                body: { ...mockedAuthor },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            Author.create.mockResolvedValueOnce(null);
            await insert(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'author creation failed',
            });
        });

        it('should handle unexpected error', async () => {
            const req = {
                body: { ...mockedAuthor },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            Author.create.mockRejectedValueOnce(new Error('unexpected error'));
            await insert(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'author creation failed',
                e: new Error('unexpected error'),
            });
        });
    });
    describe('update()', () => {
        it('should throw an error if id is missing', async () => {
            const req = {
                body: { ...mockedAuthor },
                params: {},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'author id missing',
            });
        });

        it('should throw an error if id is not valid', async () => {
            const req = {
                body: { ...mockedAuthor },
                params: { id: 'not-valid-id' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'author id not valid',
            });
        });

        it('should update an author', async () => {
            const req = {
                body: {
                    name: 'andrew black',
                    position: 'junior editor',
                    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled`,
                },
                params: { id: '658ea93c9f2770a33a70a3ba' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            author.findByIdAndUpdate.mockResolvedValueOnce({ ...req.body });
            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                updatedAuthor: { ...req.body },
            });
        });

        it('should handle unexpected error', async () => {
            const req = {
                body: { ...mockedAuthor },
                params: { id: '658ea93c9f2770a33a70a3ba' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await Author.findByIdAndUpdate.mockRejectedValueOnce(
                new Error('unexpected error')
            );
            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'updating author failed. please try later',
                e: new Error('unexpected error'),
            });
        });
    });
    describe('delete()', () => {
        it('should throw an error if id is missing', async () => {
            const req = { body: {}, params: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await remove(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'author id missing',
            });
        });

        it('should throw an error if id is not valid', async () => {
            const req = { body: {}, params: { id: 'not-valid' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await remove(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'author id not valid',
            });
        });

        it('should delete a news', async () => {
            const req = {
                params: { id: '658ea93c9f2770a33a70a3ba' },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Author.findByIdAndDelete.mockResolvedValueOnce(mockedAuthor);
            await remove(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'author deleted',
            });
        });
    });
});
