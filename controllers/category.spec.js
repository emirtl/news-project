const Category = require('../models/category');
const { getAll, insert, update, delete: remove } = require('./category');

jest.mock('../models/category');

const req = {
    body: { title: 'military' },
    params: { id: '6585658f4b6264f49f4a79e5' },
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

describe('category controller', () => {
    describe('getAll()', () => {
        it('should throw an error if fetching categories failed', async () => {
            await Category.find.mockResolvedValueOnce(null);
            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'fetching categories failed',
            });
        });

        it('should handle unexpected errors', async () => {
            const emtyReq = { body: {} };

            await Category.find.mockRejectedValueOnce(
                new Error('unexpected errors')
            );
            await getAll(emtyReq, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'fetching categories failed',
                e: new Error('unexpected errors'),
            });
        });
    });
    describe('insert()', () => {
        it('should throw an error if body is empty', async () => {
            const emtyReq = { body: {} };
            await insert(emtyReq, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'category title is needed',
            });
        });

        it('should create a category model ', async () => {
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
        it('should throw an error if body is empty', async () => {
            const emptyReq = { body: {} };
            await update(emptyReq, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'category title is needed',
            });
        });

        it('should throw an error if id is missing', async () => {
            const fakeReq = {
                body: { title: 'military' },
                params: {},
            };
            await update(fakeReq, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'category id missing',
            });
        });

        it('should update and return the updated category', async () => {
            const req = {
                params: { id: '6585658f4b6264f49f4a79e5' },
                body: { title: 'updated category title' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockUpdatedCategory = { title: 'updated category title' };
            Category.findByIdAndUpdate.mockReturnValueOnce(mockUpdatedCategory);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                updatedCategory: mockUpdatedCategory,
            });
        });

        it('should handle unexpected errors', async () => {
            Category.findByIdAndUpdate.mockRejectedValueOnce(
                new Error('unexpected error')
            );

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'updating category failed. please try later',
                e: new Error('unexpected error'),
            });
        });
    });
    describe('delete()', () => {
        it('shouldthrow an error if id is missing', async () => {
            const fakeReq = {
                params: {},
            };
            await remove(fakeReq, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'category id missing',
            });
        });
    });
});
