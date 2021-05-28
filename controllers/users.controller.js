const createError = require("http-errors");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

module.exports.user = (req, res, next) => {
  res.json("eeey");
};
module.exports.get = (req, res, next) => {
  User.findById(req.currentUser).then((user) => {
    if (!user) {
      next(createError(404, "User not found"));
    } else {
      res.json(user);
    }
  });
};

module.exports.aunthenticate = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      next(
        createError(404, {
          errors: { email: "Email or password are not valid" },
        })
      );
    } else {
      return user.checkPassword(password).then((match) => {
        if (!match) {
          next(
            createError(404, {
              errors: { email: "Email or password are not valid" },
            })
          );
        } else {
          // Generate JWT Token
          res.json({
            access_token: jwt.sign(
              { id: user._id },
              process.env.JWT_SECRET || "changeme",
              {
                expiresIn: "1h",
              }
            ),
          });
        }
      });
    }
  });
};

module.exports.create = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        // Error if email is already in the database
        next(
          createError(400, {
            errors: { email: "This email is already in use" },
          })
        );
      } else {
        // User creation
        return User.create(req.body).then((user) => res.status(201).json(user));
      }
    })
    .catch(next);
};
