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
  res.send('Gold Update get to be implemented');
});
