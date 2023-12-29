const { getAll, insert, update, delete: remove } = require('./news');

const News = require('../models/news.js');
jest.mock('../models/news');

const news = {
    //_id: '658ea93c9f2770a33a70a3ba',
    title: 'news',
    description: 'some description',
    richDescription: 'some richDescription',
    image: 'test.jpg',
    author: 'dasd23131eqd111_qwd12',
    category: 'asdasd23131eqd111_qwd',
};

afterEach(() => jest.resetAllMocks());

describe('news controller', () => {
    describe('getAll()', () => {
        it('should return an array of news', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockedNews = [news];
            News.find.mockResolvedValueOnce(mockedNews);
            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ news: mockedNews });
        });

        it('should handle an unexpected error', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            News.find.mockRejectedValueOnce(new Error('unexpected error'));
            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'fetching news failed',
                e: new Error('unexpected error'),
            });
        });
    });
    describe('insert()', () => {
        it('should throw an error if req.body is empty', async () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await insert(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'news body is needed',
            });
        });

        it('should throw an error if req.file is empty', async () => {
            const req = { body: { ...news } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await insert(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'image is needed',
            });
        });

        it('should create and insert a news', async () => {
            const req = {
                body: { ...news },
                file: {
                    filename: 'test.jpg',
                },
                protocol: 'http', // Mock protocol and host
                get: () => 'localhost:3000',
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            News.create.mockResolvedValueOnce(news);

            await insert(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                news,
            });
        });

        it('should handle unexpected error', async () => {
            const req = {
                body: { ...news },
                file: {
                    filename: 'test.jpg',
                },
                protocol: 'http', // Mock protocol and host
                get: () => 'localhost:9000',
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            News.create.mockRejectedValueOnce(new Error('unexpected error'));
            await insert(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'news creation failed',
                e: new Error('unexpected error'),
            });
        });
    });
    describe('update()', () => {
        it('should throw an error if id is missing', async () => {
            const req = { body: {}, params: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'news id missing' });
        });

        it('should throw an error if id is not valid', async () => {
            const req = { body: {}, params: { id: 'not-valid' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'news id not valid',
            });
        });

        it('should update news', async () => {
            const req = {
                body: { ...news },
                params: { id: '658ea93c9f2770a33a70a3ba' },
                file: {
                    filename: 'test.jpg',
                },
                protocol: 'http',
                get: () => 'localhost:9000',
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            News.findById.mockResolvedValueOnce(news);

            News.findByIdAndUpdate.mockResolvedValueOnce(news);

            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                updatedNews: news,
            });
        });
    });
    describe('delete()', () => {
        it('should throw an error if id is missing', async () => {
            const req = { body: {}, params: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'news id missing' });
        });

        it('should throw an error if id is not valid', async () => {
            const req = { body: {}, params: { id: 'not-valid' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'news id not valid',
            });
        });

        it('should delete a news', async () => {
            const req = {
                params: { id: '658ea93c9f2770a33a70a3ba' },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            News.findByIdAndDelete.mockResolvedValueOnce(news);
            await remove(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'news deleted',
            });
        });
    });
});
