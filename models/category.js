const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100, unique: true }, // lowercase: true
  user: { type: Schema.Types.ObjectId, ref: 'user' }, // user that created this category
  default: { type: Boolean, default: false },
});

// Virtual for genre's URL
CategorySchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/category/${this._id}`;
});

// Export model
module.exports = mongoose.model('Category', CategorySchema);
