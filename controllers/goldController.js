const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Gold = require('../models/gold');

// Display gold detail
exports.gold_detail = asyncHandler(async (req, res, next) => {
  const gold = await Gold.findOne({}).exec();

  res.render('gold_detail', {
    title: 'Gold Overview',
    gold,
  });
});

// Display gold update form on GET.
exports.gold_update_get = asyncHandler(async (req, res, next) => {
  const [gold] = await Promise.all([Gold.findOne({}).exec()]);

  if (gold === null) {
    // No results
    const err = new Error('Gold not found');
    err.status = 404;
    return next(err);
  }

  res.render('gold_form', {
    title: 'Update Gold',
    gold,
  });
});

// Handle gold update on POST
exports.gold_update_post = [
  body('quantity', 'Quantity must be whole and non-negative.')
    .isInt({ min: 0 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create Gold object with old id
    const gold = new Gold({
      quantity: req.body.quantity,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render('gold_form', {
        title: 'Update Gold',
        gold,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Update the record.
      const updatedGold = await Gold.findOneAndUpdate(
        {},
        { quantity: gold.quantity }
      );
      // Redirect to gold overview page.
      res.redirect('/catalog/gold');
    }
  }),
];
