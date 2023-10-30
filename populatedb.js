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

async function itemCreate(
  index,
  name,
  description,
  category,
  quantity,
  value,
  rarity,
  equippable,
  equipped
) {
  const itemdetail = {
    name,
    description,
    quantity,
    value,
    rarity,
    equippable,
    equipped,
  };
  if (category !== false) itemdetail.category = category;

  const item = new Item(itemdetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function goldCreate(quantity, transactions) {
  const goldDetail = {
    quantity,
    transactions,
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
    categoryCreate(3, 'Magic'),
  ]);
}

async function createItems() {
  console.log('Adding Items');
  await Promise.all([
    itemCreate(
      0,
      'Adamantine Armor',
      "This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.",
      [categories[2], categories[3]],
      1,
      500,
      'Uncommon',
      true,
      true
    ),
    itemCreate(
      1,
      'Potion of Healing (Greater)',
      "You regain 4d4 + 4 hit points when you drink this potion. The potion's red liquid glimmers when agitated.",
      [categories[1]],
      3,
      100,
      'Uncommon',
      false
    ),
    itemCreate(
      2,
      'Potion of Water Breathing',
      'You can breathe underwater for 1 hour after drinking this potion. Its cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.',
      [categories[1]],
      1,
      200,
      'Uncommon',
      false
    ),
    itemCreate(
      3,
      'Battleaxe',
      '1d8 slashing. Proficiency with a battleaxe allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
      [categories[0]],
      1,
      10,
      'Common',
      true,
      true
    ),
    itemCreate(
      4,
      'Dagger',
      '1d4 piercing. Proficiency with a dagger allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
      [categories[0]],
      1,
      2,
      'Common',
      true,
      false
    ),
    itemCreate(
      5,
      'Spiked Armor',
      '14 + Dex modifier (max 2) AC. Stealth: Disadvantage. Spiked armor is a rare type of medium armor made by dwarves. It consists of a leather coat and leggings covered with spikes that are usually made of metal.',
      [categories[2]],
      1,
      75,
      'Rare',
      true,
      false
    ),
    itemCreate(
      6,
      'Ring of Invisibility',
      'While wearing this ring, you can turn invisible as an action. Anything you are wearing or carrying is invisible with you. You remain invisible until the ring is removed, until you attack or cast a spell, or until you use a bonus action to become visible again.',
      [categories[3]],
      1,
      1000,
      'Legendary',
      true,
      false
    ),
    itemCreate(
      7,
      'Arrows',
      'Arrows are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.',
      [categories[0]],
      50,
      1,
      'Common',
      false
    ),
  ]);
}

async function createGold() {
  console.log('Adding Gold');
  await goldCreate(200, [
    { prevQuantity: 0, date: Date(), note: 'Initial quantity' },
  ]);
}
