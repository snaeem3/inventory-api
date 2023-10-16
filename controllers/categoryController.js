const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Item = require('../models/item');

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render('category_list', {
    title: 'Category List',
    list_categories: allCategories,
  });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  // Get details of category and all associated items (in parallel)
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name description').exec(),
  ]);
  if (category === null) {
    // No results.
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_detail', {
    title: 'Category Detail',
    category,
    category_items: itemsInCategory,
  });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', { title: 'Create Category' });
});

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body('name', 'Genre name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('category_form', {
        title: 'Create Category',
        category,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const categoryExists = await Category.findOne({
        name: req.body.name,
      }).exec();
      if (categoryExists) {
        // Category exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to category detail page.
        res.redirect(category.url);
      }
    }
  }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category delete GET');
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category delete POST');
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category update GET');
});

// Handle Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category update POST');
});
