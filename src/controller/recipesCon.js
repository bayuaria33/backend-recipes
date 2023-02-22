const ApiResult = require("../middleware/error/ApiResult");

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
      next(ApiResult.success(`Data recipe found`, showRecipe.rows))
    } catch (error) {
      next(ApiResult.badRequest(`Error, message: ${error.message}`));
    }
  },

  getRecipeById: async (req, res, next) => {
    try {
      let id = req.params.id;
      if (isNaN(id)) {
        next(ApiResult.badRequest(`Bad Request, id is not a number`));
        return;
      }
      let showRecipe = await selectDataRecipeById(id);
      console.log(`showrecipe = `);
      let foundRecipe = showRecipe.rows[0];
      console.log(foundRecipe);
      if (!foundRecipe) {
        next(ApiResult.badRequest(`Bad Request, data recipe not found`));
        return;
      }
      res
        .status(200)
        .json({ status: 200, message: `data found`, data: showRecipe.rows });
    } catch (error) {
      next(ApiResult.badRequest(`Error, message: ${error.message}`));
    }
  },

  postDataRecipe: async (req, res, next) => {
    try {
      let data = {};
      data.title = req.body.title;
      data.ingredients = req.body.ingredients;
      data.photo = req.body.photo;
      data.users_id = req.body.users_id;
      data.categories_id = req.body.categories_id;
      let result = await insertDataRecipe(data);
      if (!result) {
        next(ApiResult.badRequest(`Failed to insert recipe data`));
        return;
      }
      next(ApiResult.success(`Data inserted successfully`))
    } catch (error) {
      next(ApiResult.badRequest(`Error, message: ${error.message}`));
    }
  },

  putDataRecipe: async (req, res, next) => {
    try {
      let result;
      let id = req.params.id;
      let {
        rows: [recipes],
      } = await selectDataRecipeByIdForPut(id);
      let data = {
        title: req.body.title || recipes.title,
        ingredients: req.body.ingredients || recipes.ingredients,
        photo: req.body.photo || recipes.photo,
        created_at: req.body.created_at || recipes.created_at,
        users_id: req.body.users_id || recipes.users_id,
        categories_id: req.body.categories_id || recipes.categories_id,
      };
      result = await updateDataRecipe(id, data);
      if (!result) {
        next(ApiResult.badRequest(`Update data recipe failed`));
      }
      let checkData = await selectDataRecipeById(id);
      console.log(`cek data = ${checkData}`);
      next(ApiResult.success(`Update data recipe successful`, checkData.rows))
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
      next(ApiResult.success(`Delete data recipe successful`, `${id} deleted`))
    } catch (error) {
      next(ApiResult.badRequest(error.message));
    }
  },
};

module.exports = recipesController;
