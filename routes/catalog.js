const express = require('express');
const multer = require('multer');

const router = express.Router();

// Require controller modules.
const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

/// Item ROUTES ///

// POST request for creating item.
router.post(
  '/item',
  authController.verifyToken,
  // upload.single('image'),
  item_controller.item_create_post
);

// GET request for one item.
router.get('/item/:id', item_controller.item_detail);

router.put('/item/:id', authController.verifyToken, item_controller.updateItem);

router.put(
  '/item/:id/picture',
  authController.verifyToken,
  upload.single('image'),
  item_controller.updateItemPicture
);

// GET request for list of all item items.
router.get('/items', item_controller.item_list);

// GET request for list of all equippable items.
router.get('/items/equippable', item_controller.equippable_list);

// DELETE request for one item
router.delete(
  '/item/:id',
  authController.verifyToken,
  item_controller.deleteItem
);

// POST request for creating category.
router.post('/category/create', category_controller.category_create_post);

// Delete request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all categories.
router.get('/categories', category_controller.category_list);

module.exports = router;
