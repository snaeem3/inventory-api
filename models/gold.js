const mongoose = require('mongoose');

const { Schema } = mongoose;

const GoldSchema = new Schema({
  quantity: { type: Number, required: true, min: 0 },
});

// Virtual for gold's URL
// GoldSchema.virtual('url').get(function () {
//   // We don't use an arrow function as we'll need the this object
//   return `/catalog/gold/${this._id}`;
// });

// Export model
module.exports = mongoose.model('Gold', GoldSchema);
