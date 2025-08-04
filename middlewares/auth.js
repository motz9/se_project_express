const jwt = require("jsonwebtoken");
const NOT_AUTHORIZED_STATUS_CODE = require("../utils/errors");
const { JWT_SECRET } = process.env;

const verifyToken = function (req, res, next) {
  if (req.headers.authorization) {
    req.headers.authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } else {
    req.headers.authorization.catch((err) => {
      console.error(err);
      return res
        .status(NOT_AUTHORIZED_STATUS_CODE)
        .send({ message: err.message });
    });
  }
};

