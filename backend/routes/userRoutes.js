const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', isLoggedIn, logoutUser);

module.exports = router;