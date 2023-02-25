const ApiResult = require("../middleware/error/ApiResult");
const cloudinary = require("../config/uploadconfig");
const {
  selectDataRecipe,
  insertDataRecipe,
  selectDataRecipeById,
  selectDataRecipeByIdForPut,
  updateDataRecipe,
  deleteDataRecipe,
} = require("../model/recipeModel");

const recipesController = {
  getAllRecipes: async (req, res, next) => {
    try {
      let { searchBy, search, sortBy, sort } = req.query;
      let data = {
        searchBy: searchBy || "title",
        search: search || "",
        sortBy: sortBy || "created_at",
        sort: sort || "ASC",
      };
      data.page = parseInt(req.query.page) || 1;
      data.limit = parseInt(req.query.limit) || 10;
      data.offset = (data.page - 1) * data.limit;
      let showRecipe = await selectDataRecipe(data);
      if (showRecipe.rows.length === 0) {
        next(
          ApiResult.badRequest(
            `Data not Found, recipe with ${data.searchBy} = ${data.search} does not exist`
          )
        );
        return;
      }
      next(ApiResult.success(`Data recipe found`, showRecipe.rows));
    } catch (error) {
      next(ApiResult.badRequest(`Error, message: ${error.message}`));
    }
  },
  getRecipeById: async (req, res, next) => {
    try {
      let { searchBy, search, sortBy, sort } = req.query;
      let data = {
        searchBy: searchBy || "title",
        search: search || "",
        sortBy: sortBy || "created_at",
        sort: sort || "ASC",
        id: req.payload.id,
      };

      let result = await selectDataRecipeById(data);

      if (!result) {
        return next(ApiResult.badRequest(`Get my recipe data failed`));
      }

      next(ApiResult.success(`Get my recipe successful`, result.rows));
    } catch (error) {
      next(ApiResult.badRequest(`Error, message: ${error.message}`));
    }
  },

  postDataRecipe: async (req, res, next) => {
    try {
      //upload file
      const imageUrl = await cloudinary.uploader.upload(req.file.path, {
        folder: "recipes_images",
      });
      if (!imageUrl) {
        next(
          ApiResult.badRequest(`Insert data failed, failed to upload photo`)
        );
      }
      let data = {
        title: req.body.title,
        ingredients: req.body.ingredients,
        photo: imageUrl.secure_url,
        users_id: req.payload.id,
        categories_id: req.body.categories_id,
      };
      let result = await insertDataRecipe(data);
      if (!result) {
        next(ApiResult.badRequest(`Failed to insert recipe data`));
        return;
      }
      next(ApiResult.success(`Data inserted successfully`));
    } catch (error) {
      next(ApiResult.badRequest(`Error, message: ${error.message}`));
    }
  },

  putDataRecipe: async (req, res, next) => {
    try {
      let id = req.params.id;
      let {
        rows: [recipes],
      } = await selectDataRecipeByIdForPut(id);
      if (!req.file) {
        req.body.photo = recipes.photo;
      } else {
        const imageUrl = await cloudinary.uploader.upload(req.file.path, {
          folder: "recipes_images",
        });
        if (!imageUrl) {
          next(
            ApiResult.badRequest(`Update data failed, failed to upload photo`)
          );
        }
        req.body.photo = imageUrl.secure_url
      }

      let data = {
        title: req.body.title || recipes.title,
        ingredients: req.body.ingredients || recipes.ingredients,
        photo: req.body.photo || recipes.photo,
        created_at: req.body.created_at || recipes.created_at,
        users_id: req.payload.id || recipes.users_id,
        categories_id: req.body.categories_id || recipes.categories_id,
      };
      if (req.payload.id !== recipes.users_id) {
        return next(ApiResult.badRequest(`You don't own this recipe!`));
      }
      let result = await updateDataRecipe(id, data);
      if (!result) {
        next(ApiResult.badRequest(`Update data recipe failed`));
      }
      let cekdata = await selectDataRecipeByIdForPut(id)
      next(ApiResult.success(`Update data recipe successful`, cekdata.rows));
    } catch (error) {
      next(ApiResult.badRequest(error.message));
    }
  },

  deleteDataRecipe: async (req, res, next) => {
    try {
      let id = req.params.id;
      let {
        rows: [recipes],
      } = await selectDataRecipeByIdForPut(id);
      if (!recipes) {
        next(ApiResult.badRequest(`Recipe with id ${id} does not exist`));
        return;
      }
      let result = await deleteDataRecipe(id);
      if (!result) {
        next(ApiResult.badRequest(`Delete data recipe failed`));
        return;
      }
      next(ApiResult.success(`Delete data recipe successful`, `${id} deleted`));
    } catch (error) {
      next(ApiResult.badRequest(error.message));
    }
  },
};

module.exports = recipesController;
