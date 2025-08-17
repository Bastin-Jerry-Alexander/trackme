const Delivery = require('../models/delivery');

exports.createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ trackingId: req.params.id });
    if (!delivery) return res.status(404).json({ error: 'Not found' });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { trackingId: req.params.id },
      req.body,
      { new: true }
    );
    if (!delivery) return res.status(404).json({ error: 'Not found' });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
