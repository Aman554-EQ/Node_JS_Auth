const express = require('express');
const {registerUser, loginUser} = require('../controllers/auth-controller');
const router = express.Router();

// Define authentication routes here
router.post('/login', loginUser);
router.post('/register', registerUser);




module.exports = router;