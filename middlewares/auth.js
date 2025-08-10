const jwt = require("jsonwebtoken");
const { NOT_AUTHORIZED_STATUS_CODE } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const verifyToken = function (req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      return next();
    } catch {
      return res
        .status(NOT_AUTHORIZED_STATUS_CODE)
        .send({ message: "Not Authorized" });
    }
  }
  if (!req.headers.authorization) {
    return res
      .status(NOT_AUTHORIZED_STATUS_CODE)
      .send({ message: "Not Authorized" });
  }
};

module.exports = { verifyToken };
