const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Item = require('../models/item');

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  // Create an array to store category counts
  const categoryCounts = await Promise.all(
    allCategories.map(async (category) => {
      const count = await Item.countDocuments({ category: category._id });
      return {
        category,
        count,
      };
    })
  );

  res.render('category_list', {
    title: 'Category List',
    list_categories: allCategories,
    category_counts: categoryCounts,
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
  body('name', 'Category name must contain at least 3 characters')
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
  // Get details of category and all its items (in parallel)
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name description').exec(),
  ]);

  if (category === null) {
    // No results.
    res.redirect('/catalog/categories');
  }

  res.render('category_delete', {
    title: 'Delete Category',
    category,
    category_items: allItemsInCategory,
  });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of category and all its items (in parallel)
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name description').exec(),
  ]);

  if (allItemsInCategory.length > 0) {
    // Category has items. Render in same way as for GET route.
    res.render('category_delete', {
      title: 'Delete Category',
      category,
      category_items: allItemsInCategory,
    });
  } else {
    // Category has no items. Delete object and redirect to the list of categories.
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect('/catalog/categories');
  }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // No results
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_form', {
    title: 'Update Category',
    category,
  });
});

// Handle Category update on POST.
exports.category_update_post = [
  // Validate and sanitize the name field.
  body('name', 'Category name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('category_form', {
        title: 'Create Category',
        category,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.
      await Category.findByIdAndUpdate(req.params.id, category);
      // New category saved. Redirect to category detail page.
      res.redirect(category.url);
    }
  }),
];
