const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  CONFLICT_ERROR_STATUS_CODE,
  NOT_AUTHORIZED_STATUS_CODE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
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
      .then((createdUser) => {
        const safeUserData = {
          name: createdUser.name,
          avatar: createdUser.avatar,
          email: createdUser.email,
        };
        res.status(201).send(safeUserData);
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res
            .status(BAD_REQUEST_STATUS_CODE)
            .send({ message: "Invalid data" });
        }
        if (err.code === 11000) {
          res
            .status(CONFLICT_ERROR_STATUS_CODE)
            .send({ message: "There was a conflict on the server" });
        }
        return res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: "An error has occurred on the server" });
      })
  );
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(200).send(user))
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

const updateCurrentUser = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
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
        res.status(201).send(token);
      });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(NOT_AUTHORIZED_STATUS_CODE)
        .send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  updateCurrentUser,
  loginUser,
};
