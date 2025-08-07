const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { verifyToken } = require("../middlewares/auth");

router.use("/users", verifyToken, userRouter);
router.use("/items", itemRouter);

module.exports = router;
