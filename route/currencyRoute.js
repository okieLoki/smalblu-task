const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { currencyConvert, liveRates, historicalRates } = require('../controller/currencyController');

router.get('/convert', auth, currencyConvert);
router.get('/live', auth, liveRates)
router.get('/historical', auth, historicalRates)

module.exports = router;

