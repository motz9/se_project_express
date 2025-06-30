const router = require("express").Router();

router.get("/", () => console.log("GET items"));
router.post("/", () => console.log("POST items"));
router.delete("/:itemId", () => console.log("DELETE items by ID"));

module.exports = router;