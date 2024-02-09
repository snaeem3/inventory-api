const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  //   displayName: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, unique: true, maxLength: 100 },
  password: { type: String, required: true, minLength: 6 },

  itemInstances: [{ type: Schema.Types.ObjectId, ref: 'ItemInstance' }],
  customCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  // gold
});

// Virtual for User's URL.
UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
