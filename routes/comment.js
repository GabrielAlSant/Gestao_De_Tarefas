var express = require('express');
var router = express.Router();
const { addcomentario } = require('../controllers/commentcontroller')


router.post('/:id/task', addcomentario);


module.exports = router;
