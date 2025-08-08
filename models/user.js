const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "The email field is required."],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid Email",
    },
  },
  password: {
    type: String,
    required: [true, "The password field is required."],
    select: false,
    validate: {
      validator(value) {
        return validator.isStrongPassword(value);
      },
      message:
        "Password must at least 8 characters and contain 1 uppercase, 1 lowercase, and 1 symbol.",
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user;
      });
    });
};

userSchema.methods.createJWT = function createJWT() {
  return jwt.sign({ _id: this._id }, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = mongoose.model("user", userSchema);
