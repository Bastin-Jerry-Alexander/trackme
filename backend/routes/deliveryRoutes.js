const express = require('express');
const router = express.Router();
const { createDelivery, getDelivery, updateDelivery } = require('../controllers/deliveryController');

router.post('/', createDelivery);
router.get('/:id', getDelivery);
router.patch('/:id', updateDelivery);

module.exports = router;
