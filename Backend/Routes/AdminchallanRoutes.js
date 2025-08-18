const express = require('express');
const router = express.Router();
const { generateChallan } = require('../controllers/challanController');

router.post('/generate', generateChallan);

module.exports = router;
