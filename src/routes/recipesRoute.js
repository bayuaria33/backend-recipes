const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  postDataRecipe,
  getRecipeById,
  putDataRecipe,
  deleteDataRecipe,
} = require("./../controller/recipesCon");
const {protect} = require('../middleware/auth')


router.get("/",protect, getAllRecipes);
router.get('/my-recipe',protect,getRecipeById)
router.post("/",protect, postDataRecipe);
router.put("/:id",protect, putDataRecipe);
router.delete("/:id",protect, deleteDataRecipe);
module.exports = router;
