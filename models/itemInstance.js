const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemInstanceSchema = new Schema({
  item: { type: Schema.ObjectId, ref: 'Item', required: true },
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  equipped: { type: Boolean, default: false },
});

// Virtual for item's URL
// ItemInstanceSchema.virtual('url').get(function () {
//   // We don't use an arrow function as we'll need the this object
//   return `/catalog/item/${this._id}`;
// });

// Export model
module.exports = mongoose.model('ItemInstance', ItemInstanceSchema);
