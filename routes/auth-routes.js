const express = require('express');
const {registerUser, loginUser,changePassword} = require('../controllers/auth-controller');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

// Define authentication routes here
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/change-password', authMiddleware, changePassword);




module.exports = router;