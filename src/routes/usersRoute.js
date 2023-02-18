const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  postDataUser,
  getUserById,
  putDataUser,
  deleteDataUser,
} = require("./../controller/usersCon");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", postDataUser);
router.put("/:id", putDataUser);
router.delete("/:id", deleteDataUser);

module.exports = router;
