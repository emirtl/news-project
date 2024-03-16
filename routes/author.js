const express = require('express');
const router = express.Router();
const controller = require('../controllers/author');

router.get('/getAll', controller.getAll);

router.get('/getOne/:id', controller.getOne);

router.post('/insert', controller.insert);

router.put('/update/:id', controller.update);

router.delete('/delete/:id', controller.delete);

module.exports = router;
