const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, (req, res) => {
  res.status(200).json({ success: true, message: 'Logout successful' });
});
router.get('/me', protect, getMe);

module.exports = router;
