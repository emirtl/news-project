const express = require('express');
const router = express.Router();
const controller = require('../controllers/news');
const multer = require('multer');
const isAuthenticatedUser = require('../middlewares/isAuthenticated');
// const isAuthenticatedUser = require("../middlewares/isAuth");

const MIME_TYPE = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpg',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error('file format is not an image');
        if (isValid) {
            error = null;
        }
        cb(error, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const name = `${file.originalname.toLocaleLowerCase().split('.')[0]}`;
        const uniqueSuffix = `${file.fieldname}-${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}`;
        const ext = MIME_TYPE[file.mimetype];
        cb(null, `${uniqueSuffix}-${name}.${ext}`);
    },
});

router.get('/getAll', controller.getAll);

router.post(
    '/insert',
    isAuthenticatedUser,
    multer({ storage }).single('image'),
    controller.insert
);

router.put(
    '/update/:id',
    isAuthenticatedUser,
    multer({ storage }).single('image'),
    controller.update
);

isAuthenticatedUser, router.delete('/delete/:id', controller.delete);

module.exports = router;
