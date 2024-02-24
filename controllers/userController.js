const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Item = require('../models/item');

exports.getInventory = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: 'itemInventory',
      populate: { path: 'item', model: 'Item' },
    });
    res.status(200).json(user.itemInventory);
  } catch (error) {
    console.error('Error fetching inventory: ', error);
  }
});

exports.updateInventory = [
  // validate

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.userId);

    if (user._id !== req.user._id && !req.user.admin) {
      return res.status(403).json({
        message: 'You must be the owner of this inventory or an admin',
      });
    }

    // Update the user's inventory array
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { itemInventory: req.body.inventory },
      { new: true }
    );

    res.status(200).json(updatedUser.itemInventory);
  }),
];

exports.addItemToInventory = [
  body('quantity', 'Quantity must be whole and greater than 0')
    .isInt({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.userId);

    if (user.id !== req.user.userId && !req.user.admin) {
      return res.status(403).json({
        message: 'You must be the owner of this inventory or an admin',
      });
    }

    const inventoryIndex = user.itemInventory.findIndex(
      (inventoryItem) => inventoryItem.item._id === req.body.itemId
    );

    if (inventoryIndex === -1) {
      // Item not found in inventory
      const item = await Item.findById(req.body.itemId);

      // Item doesn't exist
      if (item === null || item === 'null') {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
      }

      // Item exists, but needs to be added for this user
      const newItem = { item, quantity: req.body.quantity };

      user.itemInventory.push(newItem);
    } else {
      // Item is in inventory
      user.itemInventory[inventoryIndex] += req.body.quantity;
    }

    await user.save();
    res.status(200).json(user.itemInventory);
  }),
];

exports.changeInventoryItem = [
  body('newQuantity', 'Quantity must be whole and positive')
    .isInt({ min: 0 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.userId).populate({
      path: 'itemInventory',
      populate: { path: 'item', model: 'Item' },
    });

    if (user.id !== req.user.userId && !req.user.admin) {
      return res.status(403).json({
        message: 'You must be the owner of this inventory or an admin',
      });
    }

    const inventoryIndex = user.itemInventory.findIndex(
      (inventoryItem) => inventoryItem.item.id === req.params.itemId
    );

    console.log('inventory index', inventoryIndex);
    if (inventoryIndex === -1) {
      // Item not found in inventory
      const item = await Item.findById(req.params.itemId);

      // Item doesn't exist
      if (item === null || item === 'null') {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
      }

      // Item exists, but not added to inventory
      const err = new Error('Item not currently in inventory');
      err.status = 400;
      return next(err);
    }

    // Item is in inventory
    if (req.body.newQuantity)
      user.itemInventory[inventoryIndex].quantity = req.body.newQuantity;
    if (req.body.favorite)
      user.itemInventory[inventoryIndex].favorite = req.body.favorite;

    await user.save();
    res.status(200).json(user.itemInventory[inventoryIndex]);
  }),
];

exports.deleteInventoryItem = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId).populate({
    path: 'itemInventory',
    populate: { path: 'item', model: 'Item' },
  });

  if (user.id !== req.user.userId && !req.user.admin) {
    return res.status(403).json({
      message: 'You must be the owner of this inventory or an admin',
    });
  }

  const inventoryIndex = user.itemInventory.findIndex(
    (inventoryItem) => inventoryItem.item.id === req.params.itemId
  );

  console.log('inventoryIndex: ', inventoryIndex);

  if (inventoryIndex === -1) {
    // Item not found in inventory
    const item = await Item.findById(req.params.itemId);

    // Item doesn't exist
    if (item === null || item === 'null') {
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }

    // Item exists, but not added to inventory
    const err = new Error('Item not currently in inventory');
    err.status = 400;
    return next(err);
  }

  user.itemInventory.splice(inventoryIndex, 1);

  await user.save();
  res.status(200).json(user.itemInventory);
});

exports.getGold = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user.gold);
  } catch (error) {
    console.error('Error fetching Gold: ', error);
  }
});

exports.addTransaction = [
  body('newQuantity', 'New quantity must be whole and non-negative')
    .isInt({ min: 0 })
    .escape(),
  body('note', 'Transaction note required').trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.params.userId);
      user.gold.transactions.push({
        prevQuantity: req.body.newQuantity,
        date: req.body.date,
        note: req.body.note,
      });
      user.gold.quantity = req.body.newQuantity;

      await user.save();
      res.status(200).json(user.gold);
    } catch (error) {
      console.error('Error adding transaction: ', error);
    }
  }),
];
