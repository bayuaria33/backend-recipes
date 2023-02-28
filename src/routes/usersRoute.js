const express = require("express");
const router = express.Router();
const {protect} = require('../middleware/auth')
const {
  getAllUsers,
  getUserById,
  putDataUser,
} = require("./../controller/usersCon");

router.get("/", getAllUsers);
router.get("/myprofile",protect, getUserById);
// router.post("/", postDataUser);
 router.put("/update",protect, putDataUser);
// router.delete("/:id", deleteDataUser);

module.exports = router;
