const router = require("express").Router();
const { getItems, createItem, deleteItem, likeItem, dislikeItem } = require("../controllers/clothingItems");
const { verifyToken } = require("../middlewares/auth");

router.get("/", getItems);
router.post("/", verifyToken, createItem);
router.delete("/:itemId", verifyToken, deleteItem);
router.put("/:itemId/likes", verifyToken, likeItem);
router.delete("/:itemId/likes", verifyToken, dislikeItem);


module.exports = router;