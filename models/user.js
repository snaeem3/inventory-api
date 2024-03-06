const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    //   displayName: { type: String, required: true, maxLength: 100 },
    username: { type: String, required: true, unique: true, maxLength: 100 },
    password: { type: String, required: true, minLength: 6 },
    admin: { type: Boolean, required: true, default: false },
    itemInventory: [
      {
        item: { type: Schema.Types.ObjectId, ref: 'Item', unique: true },
        quantity: { type: Number, default: 1 },
        // lastModified: { type: Schema.Types.Date, default: Date.now },
        favorite: { type: Boolean, default: false },
      },
    ],
    customCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    gold: {
      quantity: { type: Number, required: true, default: 0 },
      transactions: [
        {
          prevQuantity: Number,
          date: Date,
          note: { type: String, maxLength: 100 },
        },
      ],
    },
    profilePicture: { type: String },
    // notifications: [
    //   {
    //     message: { type: String, required: true, minLength: 1 },
    //     unRead: { type: Boolean, default: false },
    //     date: { type: Schema.Types.Date, default: Date.now },
    //   },
    // ],
  },
  { timestamps: true }
);

// Virtual for User's URL.
UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
