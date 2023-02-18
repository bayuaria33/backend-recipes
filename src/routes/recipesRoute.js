const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  postDataRecipe,
  getRecipeById,
  putDataRecipe,
  deleteDataRecipe,
} = require("./../controller/recipesCon");

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", postDataRecipe);
router.put("/:id", putDataRecipe);
router.delete("/:id", deleteDataRecipe);
module.exports = router;
