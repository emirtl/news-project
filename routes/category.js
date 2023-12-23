const express = require('express');
const router = express.Router();
const controller = require('../controllers/category');

router.get('/getAll', controller.getAll);

router.post('/insert', controller.insert);

router.put('/update/:id', controller.update);

router.delete('/delete/:id', controller.delete);

module.exports = router;
