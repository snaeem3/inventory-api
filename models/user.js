const mongoose = require('mongoose');

const { Schema } = mongoose;

const InventoryItemSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, default: 1 },
    favorite: { type: Boolean, default: false },
    equipped: { type: Boolean },
    // customDescription: { type: String },
  },
  { timestamps: true }
);

const UserSchema = new Schema(
  {
    //   displayName: { type: String, required: true, maxLength: 100 },
    username: { type: String, required: true, unique: true, maxLength: 100 },
    password: { type: String, required: true, minLength: 6 },
    admin: { type: Boolean, required: true, default: false },
    itemInventory: [InventoryItemSchema],
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

// Define virtual field to calculate net worth
UserSchema.virtual('netWorth').get(function () {
  let netWorth = this.gold.quantity;

  // Add value of each item multiplied by its quantity
  this.itemInventory.forEach((inventoryItem) => {
    netWorth += inventoryItem.item.value * inventoryItem.quantity || 0; // If value is undefined, consider it as 0
  });

  return netWorth;
});

module.exports = mongoose.model('User', UserSchema);
