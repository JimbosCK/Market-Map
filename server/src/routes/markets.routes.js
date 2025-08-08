const express = require('express');
const router = express.Router();
const { createMarket, getMarkets, getVerifiedMarkets, deleteMarket } = require('../controllers/market.controller');

router.post('/', createMarket);

router.get('/', getMarkets);

router.get('/verified', getVerifiedMarkets);
router.delete('/:id', deleteMarket);

module.exports = router;