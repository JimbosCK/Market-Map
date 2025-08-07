const express = require('express');
const router = express.Router();
const { createMarket, getMarkets } = require('../controllers/market.controller');

router.post('/', createMarket);

router.get('/', getMarkets);

module.exports = router;