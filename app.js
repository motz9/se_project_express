const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { NOT_FOUND_STATUS_CODE } = require("./utils/errors");
const { loginUser, createUser } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "68620e34acb6d41ef2ffc4cc",
    required: true,
  };
  next();
});

app.post("/signin", loginUser);
app.post("/signup", createUser);

app.use("/", mainRouter);
app.use((req, res, next) => {
  res.status(NOT_FOUND_STATUS_CODE).send({ message: "Requested resource not found" });
  next();
});

app.listen(PORT, () => {
  console.log(`App is listening at Port ${PORT}`);
});
