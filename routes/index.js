var express = require('express');
var router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require('../models/user')
const userController = require('../controllers/userController') 
const messageController = require('../controllers/messageController')
const checkIfAuthenticated = require('../config/passport')
const authenticationMiddleware = require('./authMiddleware');

router.get('/', messageController.homeGet);

router.get('/signup', userController.singUpGet);

router.post('/signup', userController.signUpPost);

router.get('/login', userController.loginGet);

router.post("/login", userController.loginPost);

router.get('/logout', userController.logout);

router.get('/member', authenticationMiddleware, userController.becomeMemberGet);

router.post('/member', userController.becomeMemberPost);

router.get('/message', authenticationMiddleware,  messageController.messageGet);

router.post('/message',  messageController.messagePost);

router.get('/*', userController.errorGet)

module.exports = router;