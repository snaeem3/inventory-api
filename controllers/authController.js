const dotenv = require('dotenv').config();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Returns true if the username is unique, false otherwise
const isUserNameUnique = async (username) => {
  const user = await User.findOne({ username });
  return !user;
};

exports.signUpGET = asyncHandler(async (req, res, next) => {
  res.json({ title: 'Sign-Up', user: req.user });
});

exports.signUpPOST = [
  // Validate and sanitize fields
  body('username', 'User Name must not be empty').trim().notEmpty().escape(),
  body('username', 'User Name must be unique')
    .trim()
    .custom(async (value, { req }) => {
      if (!(await isUserNameUnique(value))) {
        throw new Error('Username is already taken');
      }
      return true;
    }),
  body('password', 'Password must be at least 6 characters')
    .isLength({ min: 6 })
    .escape(),
  body('confirmPassword', 'Passwords must match').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        if (err) {
          return next(err); // Handle hashing error
        }

        const user = new User({
          username: req.body.username,
          password: hash,
          itemInventory: [],
          customCategories: [],
        });

        if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });
        else {
          await user.save();
          res.status(201).json({ message: 'User successfully created' });
        }
      });
    });
  }),
];

exports.loginPOST = [
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!user) {
        return res.status(401).json({ error: info.message });
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        const accessToken = jwt.sign(
          {
            name: user.username,
            isAdmin: user.admin,
            userId: user._id,
            profilePicture: user.profilePicture,
          }, // payload needs to be a plain object
          process.env.ACCESS_TOKEN_SECRET
        );
        return res.json({ message: 'Login successful', user, accessToken });
      });
    })(req, res, next);
  },
];

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else res.json({ message: 'Logout successful' });
  });
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);

  if (token === null || token === 'null') {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};
