const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  CONFLICT_ERROR_STATUS_CODE,
  NOT_AUTHORIZED_STATUS_CODE,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res
            .status(BAD_REQUEST_STATUS_CODE)
            .send({ message: "Invalid data" });
        }
        if (err.code === 11000) {
          return res
            .status(CONFLICT_ERROR_STATUS_CODE)
            .send({ message: "There was a conflict on the server" });
        }
        return res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: "An error has occurred on the server" });
      })
  );
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      return user.createJWT().then((token) => {
        res.send(token);
      });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(NOT_AUTHORIZED_STATUS_CODE)
        .send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser, loginUser };
