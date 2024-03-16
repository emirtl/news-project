const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

router.get('/getAllUsers', controller.getAllUsers);

router.post('/register', controller.register);

router.post('/login', controller.login);

router.delete('/deleteUser/:id', controller.deleteUser);

module.exports = router;
