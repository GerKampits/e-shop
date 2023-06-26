const express = require('express');
const router = express.Router();

// σύνδεση με τον controller
const userProductController = require('../controllers/user.product.controller')

// κλήση από τον controller της διαδικασίας findOne
router.get('/findone/:username', userProductController.findOne);
router.post('/create', userProductController.create);
router.patch('/update', userProductController.update);
router.delete('/delete/:username/:product', userProductController.delete)
router.get('/stats1/:username', userProductController.stats1)

module.exports = router;