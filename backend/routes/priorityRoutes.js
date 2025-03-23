const express = require("express");
const { fetchPriorityList } = require("../controllers/priorityController");
const router = express.Router();

router.get("/priority-list", fetchPriorityList);

module.exports = router;
