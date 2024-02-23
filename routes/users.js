const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// GET request for user's inventory
router.get(
  '/:userId/inventory',
  authController.verifyToken,
  userController.getInventory
);

// PUT request for user's inventory
router.put(
  '/:userId/inventory',
  authController.verifyToken,
  userController.updateInventory
);

// POST request for user's inventory
router.post(
  '/:userId/inventory/add',
  authController.verifyToken,
  userController.addItemToInventory
);

// PUT request to update specific inventory item
router.put(
  `/:userId/inventory/:itemId`,
  authController.verifyToken,
  userController.changeInventoryItem
);

// DELETE request to delete specific inventory item
router.delete(
  `/:userId/inventory/:itemId`,
  authController.verifyToken,
  userController.deleteInventoryItem
);

module.exports = router;
