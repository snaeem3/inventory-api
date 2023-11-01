# Inventory Application

This project showcases a Dungeons & Dragons inventory application built with Node.js & MongoDB as part of the [Odin Project](https://www.theodinproject.com/lessons/nodejs-inventory-application) curriculum.

## [Live View](https://wandering-brook-1752.fly.dev/catalog)

# Features

- Manage your inventory by adding, removing, and updating your items
- Organize your items by creating different categories
- Track your available gold and previous transactions
- Use the _Equippable Items_ page to quickly equip/unequip items

# Skills Involved in this project

- [Mongoose](https://mongoosejs.com/) to connect to a MongoDB database
- Querying data from MongoDB: `find()`, `findById()`, `countDocuments()`, etc.
- CRUD (Create, Read, Update, and Delete) operations in MongoDB: `findByIdAndDelete()`, `findOneAndUpdate()`, etc.
- Basic and Dynamic Routing (by item ID) using Express Router
- Middleware chaining in Express
- Defining and creating Models with various schema types
- Schema Virtual to return item url and total value
- Controller modules (e.g., `itemController`, `categoryController`, `goldController`), adhering to the Model-View-Controller (MVC) architectural pattern and promoting code modularity
- View rendering using [Pug](https://pugjs.org/)
- Dynamic form handling
- Express validator to validate and sanitize form data from the backend
- Asynchronous Error Handling

# Prerequisites

Before you get started with this application, make sure you have the following prerequisites installed on your system:

- Node.js (version >= 18.12.1)
- npm (Node Package Manager)

# Installation

To install the application and its dependencies, follow these steps:

1. Clone the repository:

```shell
git clone https://github.com/snaeem3/inventory-application.git
cd inventory-application
```

2. Install the required packages:

```shell
npm install
```

# Usage

To run the application, you can use the following command:

```shell
npm start
```

Then, open the app in your web browser by navigating to http://localhost:3000.
