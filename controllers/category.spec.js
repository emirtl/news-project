const Category = require('../models/category');
const { getAll, insert } = require('./category');

jest.mock('../models/category');

describe('category controller', () => {
    describe('getAll()', () => {
        it('should throw an error if fetching categories failed', async () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await Category.find.mockResolvedValueOnce(null);
            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'fetching categories failed',
            });
        });

        it('should handle unexpected errors', async () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await Category.find.mockRejectedValueOnce(
                new Error('unexpected errors')
            );
            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'fetching categories failed',
                e: new Error('unexpected errors'),
            });
        });
    });
    describe('insert()', () => {
        it('should throw an error if body is empty', async () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await insert(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'category title is needed',
            });
        });

        it('should create a category model ', async () => {
            const req = { body: { title: 'military' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockedCategory = {
                _id: '6585658f4b6264f49f4a79e5',
                title: 'military',
            };

            Category.create.mockResolvedValueOnce(mockedCategory);
            await insert(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ category: mockedCategory });
        });

        it('should handle unexpected errors', async () => {
            const req = { body: { title: 'military' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockedCategory = {
                _id: '6585658f4b6264f49f4a79e5',
                title: 'military',
            };

            Category.create.mockRejectedValueOnce(
                new Error('unexpected error')
            );
            await insert(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'category creation failed',
                e: new Error('unexpected error'),
            });
        });
    });
    describe('update()', () => {
      
    });
    describe('delete()', () => {});
});
