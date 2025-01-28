var express = require('express');
var router = express.Router();
const {updateStatus} = require('../controllers/logcontroller')

router.post('/:id/status', updateStatus);

module.exports = router;
