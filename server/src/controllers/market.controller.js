const Market = require('../models/market.model');

// TODO: Write authorization middleware to protect some routes

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

const getVerifiedMarkets = async (req, res) => {
  try {
    const verifiedMarkets = await Market.find({ status: 'verified' });
    res.status(200).json(verifiedMarkets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMarket = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMarket = await Market.findByIdAndDelete(id);
    if (!deletedMarket) {
      return res.status(404).json({ message: 'Market not found' });
    }
    res.status(200).json({ message: 'Market deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMarket,
  getMarkets,
  getVerifiedMarkets,
  deleteMarket,

};