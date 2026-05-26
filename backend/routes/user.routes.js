const express = require('express');
const router = express.Router();
const {login, signup, updateBudget} = require('../controllers/user.controllers');
const requireAuth = require('../middleware/requireAuth');

router.post('/login', login)
router.post('/signup', signup)

router.post('/updateBudget', requireAuth, updateBudget)

module.exports = router;