var express = require('express');
var router = express.Router();
const { home, oneUsertask, createUserPage, createUser, loginPage, login } = require('../controllers/userController')

router.get('/user/tasks/:id', oneUsertask);
router.get('/home', home);
router.get('/create', createUserPage);
router.get('/', loginPage);

router.post('/user/create', createUser);
router.post('/user/login', login);

module.exports = router;
