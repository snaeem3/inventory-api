<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<div align="center">
  <!-- <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">D&D Social Inventory API</h3>

  <p align="center">
    This project showcases a Dungeons & Dragons inventory application API built with Node.js & MongoDB. This API manages client requests to store, retrieve, and manage custom D&D items, user inventories, profile pictures, and more.
    <br />
    <!-- <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br /> -->
    <br />
    <a href="https://inventory-client-plum.vercel.app/">View Demo</a>
    <!-- ·
    <a href="https://github.com/snaeem3/inventory-api/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/snaeem3/inventory-api/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a> -->
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#project-links">Project Links</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#planned-features">Planned Features</a></li>
    <li><a href="#skills-involved-with-this-project">Skills Involved with this project</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#usage">Usage</a></li>
      </ul>
    </li>
  </ol>
</details>

## Project Links

**Live Client View:** [inventory-client-plum.vercel.app/](https://inventory-client-plum.vercel.app/)

Front End: [github.com/snaeem3/inventory-client](https://github.com/snaeem3/inventory-client)

This project was inspired by a previous application: [github.com/snaeem3/inventory-application](https://github.com/snaeem3/inventory-application)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

👥 **User Management Endpoints:** Handle client requests for signing up, logging in, updating profile pictures, editing inventory items, and tracking gold

🛠️ **Catalog Item Endpoints:** Handle requests to create, read, update, and delete custom items and item pictures.

🔐 **Authentication Management:** Use JSON web tokens to ensure only authorized users can send requests to the server

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Planned Features

See the [client project](https://github.com/snaeem3/inventory-client?tab=readme-ov-file#planned-features) for planned features to the overall application

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Skills Involved in this project

- [Mongoose](https://mongoosejs.com/) to connect to a MongoDB database
- Querying data from MongoDB
- CRUD (Create, Read, Update, and Delete) operations in MongoDB: `findByIdAndDelete()`, `findByIdAndUpdate()`, etc.
- [Cloudinary](https://cloudinary.com/) to manage image storage and retrieval
- [Multer](https://www.npmjs.com/package/multer) to handle file upload requests from client
- [JSON Web Token (JWT)](https://jwt.io/) for secure and verifiable user authentication
  - Creation of token when users successfully log-in
  - Token verification when users make certain requests (e.g. Blog post creation, comment deletion, etc.)
- User authentication with [Passport.js](https://www.passportjs.org/)
  - LocalStrategy for username and password authentication
  - Managing user sessions and serialization/deserialization
- Secure password hashing using bcrypt
- [CORS](https://www.npmjs.com/package/cors) to enable requests from specified routes
- Basic and Dynamic Routing (by item ID) using Express Router
- Middleware chaining in Express
- Defining and creating Models with various schema types
- Schema Virtual to return user's net worth
- Schema Sub Documents- `InventoryItemSchema` in `models/user.js`
- Controller modules (e.g., `itemController`, `userController`, etc.), adhering to the Model-View-Controller (MVC) architectural pattern and promoting code modularity
- Express validator to validate and sanitize form data from the backend
- Asynchronous Error Handling
- App deployment with [Vercel](https://vercel.com/)

## Getting Started

To get a local copy up and running follow these simple steps.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Prerequisites

Before you get started with this application, make sure you have the following prerequisites installed on your system:

- Node.js (version >= 18.12.1)
- npm (Node Package Manager)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Installation

To install the application and its dependencies, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/snaeem3/inventory-api.git
   cd inventory-api
   ```

2. Install the required packages:

   ```shell
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:

   ```env
   MONGODB_URI=your_mongodb_uri
   ACCESS_TOKEN_SECRET=your_jwt_access_token_code
   REFRESH_TOKEN_SECRET=your_jwt_refresh_token_code
   CLOUD_NAME="your_cloudinary_cloud_name"
   API_KEY="your_cloudinary_api_key"
   API_SECRET="your_cloudinary_api_secret"
   ```

   Replace `your_mongodb_uri` with the MongoDB connection URI.

   Replace `your_jwt_access_token_code` and `your_jwt_refresh_token_code` with secret keys of your choosing.

   Replace `your_cloudinary_cloud_name`, `your_cloudinary_api_key`, and `your_cloudinary_api_secret` with your Cloudinary credentials from the Cloudinary dashboard.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Usage

To run the application, you can use the following command:

```shell
npm start
```

Then, open the app in your web browser by navigating to http://localhost:3000.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/snaeem3/inventory-api.svg?style=for-the-badge
[contributors-url]: https://github.com/snaeem3/inventory-api/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/snaeem3/inventory-api.svg?style=for-the-badge
[forks-url]: https://github.com/snaeem3/inventory-api/network/members
[stars-shield]: https://img.shields.io/github/stars/snaeem3/inventory-api.svg?style=for-the-badge
[stars-url]: https://github.com/snaeem3/inventory-api/stargazers
[issues-shield]: https://img.shields.io/github/issues/snaeem3/inventory-api.svg?style=for-the-badge
[issues-url]: https://github.com/snaeem3/inventory-api/issues
