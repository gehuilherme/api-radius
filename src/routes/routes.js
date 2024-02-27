const express = require('express');
const rateLimit = require('express-rate-limit');
const FindController = require('../controllers/FindController');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.post('/', limiter, FindController.findUserData);

module.exports = router;
