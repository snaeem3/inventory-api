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

// GET request for user's gold
router.get(`/:userId/gold`, authController.verifyToken, userController.getGold);

// PUT request for user's gold to edit quantity
router.put(
  `/:userId/gold`,
  authController.verifyToken,
  userController.editGold
);

// POST request for user's gold to create transaction
router.post(
  `/:userId/gold`,
  authController.verifyToken,
  userController.addTransaction
);

// PUT request for user's transaction
router.put(
  `/:userId/gold/:transactionId`,
  authController.verifyToken,
  userController.updateTransaction
);

// DELETE request for user's transaction
router.delete(
  `/:userId/gold/:transactionId`,
  authController.verifyToken,
  userController.deleteTransaction
);

module.exports = router;
