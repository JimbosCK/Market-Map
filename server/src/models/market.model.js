const mongoose = require('mongoose');

const closedRoadSchema = new mongoose.Schema({
  roadName: {
    type: String,
    required: true,
  },
  path: {
    type: {
      type: String,
      enum: ['LineString'],
      required: true,
      default: 'LineString',
    },
    coordinates: {
      type: [[Number]],
      required: true,
    },
  },
});

const marketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  schedule: {
    type: [String], // Array of strings, e.g., ['Tuesday', 'Friday']
    required: true,
  },
  status: {
    type: String,
    enum: ['verified', 'pending'],
    required: true,
    default: 'pending',
  },
  closedRoads: [closedRoadSchema],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create a geospatial index on the location field for efficient queries
// The '2dsphere' index is specifically for GeoJSON data on a sphere-like surface (Earth)
marketSchema.index({ 'location': '2dsphere' });

module.exports = mongoose.model('Market', marketSchema);