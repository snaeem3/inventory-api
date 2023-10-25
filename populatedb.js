#! /usr/bin/env node

console.log(
  'This script populates some items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');
const Item = require('./models/item');
const Category = require('./models/category');
const Gold = require('./models/gold');

const categories = [];
const items = [];

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  await createGold();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
  console.log('Debug: Connection closed');
  process.exit(0); // Explicitly exit the Node.js process
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the Weapon Category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, category) {
  const itemdetail = {
    name,
    description,
  };
  if (category !== false) itemdetail.category = category;

  const item = new Item(itemdetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function goldCreate(quantity) {
  const goldDetail = {
    quantity,
  };

  const gold = new Gold(goldDetail);
  await gold.save();
  console.log(`Added ${quantity} gold`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(0, 'Weapon'),
    categoryCreate(1, 'Potion'),
    categoryCreate(2, 'Armor'),
  ]);
}

async function createItems() {
  console.log('Adding Items');
  await Promise.all([
    itemCreate(0, 'Sword', 'A standard Iron Sword', [categories[0]]),
    itemCreate(
      1,
      'Potion of Healing (Greater)',
      "You regain 4d4 + 4 hit points when you drink this potion. The potion's red liquid glimmers when agitated.",
      [categories[1]]
    ),
  ]);
}

async function createGold() {
  console.log('Adding Gold');
  await goldCreate(200);
}
