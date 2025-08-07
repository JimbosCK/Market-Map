const Market = require('../models/market.model');

const createMarket = async (req, res) => {
  try {
    const newMarket = new Market(req.body);
    await newMarket.save();
    res.status(201).json(newMarket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getMarkets = async (req, res) => {
  try {
    const markets = await Market.find();
    res.status(200).json(markets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMarket,
  getMarkets,
};