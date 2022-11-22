const express = require('express');
const {login, register, activeAccout, resetPassword, renewPassword, refreshToken} = require('../controllers/user');
// const {
// 	verify
// } = require('../middlewares/authMiddleware');
const router = express.Router();

//@route    POST api/user/login
//@desc     login to system
//@asccess  Public
router.post('/login', login);

//@route    POST api/user/register
//@desc     create new account & user
//@asccess  Public
router.post('/register', register);

//@route    GET api/user/confirmation/:token
//@desc     confirm email to verify token
//@asccess  Public
router.get('/confirmation/:token', activeAccout);

//@route    POST api/user/reset-password
//@desc     confirm email to verify token
//@asccess  Public
router.post('/reset-password', resetPassword);

//@route    GET api/user/renew-password/:email
//@desc     confirm email to verify token
//@asccess  Public
router.get('/renew-password/:email', renewPassword);

//@route    POST api/user/refresh
//@desc     when accessToken expired but refreshToken not yet --> verify and create new accessToken
//@asccess  Public
router.post('/refresh-token', refreshToken);

module.exports = router;
