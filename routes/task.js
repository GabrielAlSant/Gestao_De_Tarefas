var express = require('express');
var router = express.Router();
const { alltask,  searchtask, taskdetails, createTaskPage, createTask} = require('../controllers/taskController')


router.get('/', alltask);
router.get('/search', searchtask);
router.get('/taskdetails/:id', taskdetails);
router.get('/create', createTaskPage);
router.post('/create', createTask);

module.exports = router;
