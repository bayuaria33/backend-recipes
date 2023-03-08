const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  postDataRecipe,
  getRecipeById,
  putDataRecipe,
  deleteDataRecipe,
} = require("./../controller/recipesCon");
// const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// router.get("/", protect, getAllRecipes);
// router.get("/my-recipe", protect, getRecipeById);
// router.post("/", protect, upload.single("photo"), postDataRecipe);
// router.put("/:id", protect, upload.single("photo"), putDataRecipe);
// router.delete("/:id", protect, deleteDataRecipe);

router.get("/", getAllRecipes);
router.get("/my-recipe", getRecipeById);
router.post("/", upload.single("photo"), postDataRecipe);
router.put("/:id", upload.single("photo"), putDataRecipe);
router.delete("/:id", deleteDataRecipe);
module.exports = router;
