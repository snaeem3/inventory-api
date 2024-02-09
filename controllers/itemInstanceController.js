const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Item = require('../models/item');
const ItemInstance = require('../models/itemInstance');
const User = require('../models/user');

exports.user_items = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/auth/sign-up');
  }

  const user = await User.findById(req.user._id)
    .populate({
      path: 'itemInstances',
      populate: {
        path: 'item',
        model: 'Item',
        populate: {
          path: 'category',
          model: 'Category',
        },
      },
    })
    .exec();

  const itemInstances = user.itemInstances.map((instance) => ({
    _id: instance._id,
    item: {
      // _id: instance.item._id,
      // name: instance.item.name,
      // description: instance.item.description,
      ...instance.item.toObject(),
      url: instance.item.url, // virtuals not automatically populated
    },
    equipped: instance.equipped,
  }));
  res.render('itemInstance_list', {
    title: 'Item Instances',
    itemInstances,
  });
});

exports.itemInstance_create_get = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: 'User not authenticated' });
  }
  console.log(req.user);
  const items = await Item.find({}).exec();

  res.render('itemInstance_form', { title: 'Create Item Instance(s)', items });
});

// Handle itemInstance create on POST.
exports.itemInstance_create_post = [
  // Validate and sanitize fields.
  body('item', 'Item must be specified').trim().isLength({ min: 1 }).escape(),
  body('quantity', 'Quantity must be whole and non-negative.')
    .isInt({ min: 0 })
    .escape(),
  // item must be equippable to be equipped
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: 'User not authenticated' });
    }

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    const itemInstance = new ItemInstance({
      item: req.body.item,
      user: req.user,
    });
    if (req.body.item.equippable) itemInstance.equipped = req.body.equipped;

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const items = await Item.find({}).exec();

      res.render('itemInstance_form', {
        title: 'Create Item Instance(s)',
        items,
        selected_item: itemInstance.item._id,
        errors: errors.array(),
        itemInstance,
      });
    } else {
      // Data from form is valid. Save item instances.
      for (let i = 0; i < req.body.quantity; i++) {
        try {
          await itemInstance.save();
          await User.findByIdAndUpdate(req.user._id, {
            $push: { itemInstances: itemInstance },
          });
        } catch (error) {
          console.error(error);
        }
      }
      res.redirect('/catalog/itemInstances');
    }
  }),
];
