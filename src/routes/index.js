const express = require("express");
const router = express.Router();
const Users = require("./usersRoute");
const Recipes = require("./recipesRoute");
const Categories = require("./categoriesRoute")

router.use("/users", Users);
router.use("/recipes", Recipes);
router.use("/categories", Categories);

module.exports = router;
