const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Item = require('../models/item');
const User = require('../models/user');

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  try {
    const allItems = await Item.find({}).sort({ name: 1 }).exec();
    res.status(200).json(allItems);
  } catch (error) {
    console.error('Error fetching items: ', error);
  }
});

// Return detail for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  try {
    // Get detail of item
    const item = await Item.findById(req.params.id)
      .populate('category')
      .populate({ path: 'creator', select: 'username' })
      .exec();
    if (item === null) {
      // No results.
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error ', error);
    res.status(500);
  }
});

// Handle item create on POST.
exports.item_create_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('value', 'Value must be whole and non-negative.')
    .isInt({ min: 0 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const user = await User.findById(req.user.userId);
    // Create a Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category:
        typeof req.body.category === 'undefined' ? [] : req.body.category,
      value: req.body.value,
      rarity: req.body.rarity,
      equippable:
        req.body.equippable === 'on' ||
        req.body.equippable === true ||
        req.body.equippable === 'true',
      private: req.body.private,
      creator: user,
    });

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Data from form is valid. Save item.
    await item.save();
    res.status(200).json({ item, url: item.url });
  }),
];

// Handle item delete
exports.deleteItem = asyncHandler(async (req, res, next) => {
  try {
    // Get detail of item
    const item = await Item.findById(req.params.id)
      .populate({ path: 'creator', select: 'id' })
      .exec();
    if (item === null) {
      // No results.
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }

    // Verify that user is the creator or an admin
    console.log('item.creator.id: ', item.creator._id);
    console.log('req: ', req.user.userId);
    if (
      !(
        (item.creator && item.creator.id === req.user.userId) ||
        req.user.isAdmin
      )
    ) {
      const err = new Error('You must be the item creator or an admin');
      err.status = 403;
      return next(err);
    }

    // Check if this item is currently in anyone's inventory
    const usersWithItem = await User.find({
      'itemInventory.item': req.params.id,
    });
    console.log(usersWithItem);
    if (usersWithItem.length > 0) {
      const err = new Error(
        `Item cannot be deleted: ${usersWithItem.length} user(s) currently possess this item in their inventory`
      );
      err.status = 403;
      return next(err);
    }

    await Item.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: `Item ${req.params.id} successfully deleted` });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500);
  }
});

// Handle item update
exports.updateItem = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') {
        req.body.category = [];
      } else {
        req.body.category = new Array(req.body.category);
      }
    }
    next();
  },

  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('value', 'Value must be whole and non-negative.')
    .isInt({ min: 0 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped/trimmed data and old id.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category:
        typeof req.body.category === 'undefined' ? [] : req.body.category,
      value: req.body.value,
      rarity: req.body.rarity,
      equippable:
        req.body.equippable === 'on' ||
        req.body.equippable === true ||
        req.body.equippable === 'true',
      private: req.body.private,
      // creator?
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Data from form is valid. Update the record.
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});

    res.status(200).json(updatedItem);
  }),
];

// Display list of all Equippable/Equipped Items.
exports.equippable_list = asyncHandler(async (req, res, next) => {
  const allEquippedItems = await Item.find({ equipped: true }, 'name')
    .sort({ name: 1 })
    .exec();

  const allUnequippedItems = await Item.find(
    { equippable: true, equipped: false },
    'name'
  )
    .sort({ name: 1 })
    .exec();

  // res.render('equipment_list', {
  //   title: 'Equippable Items',
  //   equippedItems: allEquippedItems,
  //   unEquippedItems: allUnequippedItems,
  // });
});
