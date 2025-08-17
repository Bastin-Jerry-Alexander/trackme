const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  address: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Dispatched', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  currentLocation: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', deliverySchema);

