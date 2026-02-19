const express = require('express');
const router = express.Router();
const { authAdmin, authClient } = require('../controllers/authController');

router.post('/admin/login', authAdmin);
router.post('/client/login', authClient);

module.exports = router;
