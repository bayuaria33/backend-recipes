const {
  selectDataRecipe,
  insertDataRecipe,
  selectDataRecipeById,
  updateDataRecipe,
  deleteDataRecipe,
} = require("../model/recipeModel");

const recipesController = {
  getAllRecipes: async (req, res, next) => {
    let { searchBy, search, sortBy, sort } = req.query;

    let data = {
      searchBy: searchBy || "title",
      search: search || "",
      sortBy: sortBy || "created_at",
      sort: sort || "ASC",
    };
    data.page = parseInt(req.query.page) || 1;
    data.limit = parseInt(req.query.limit) || 5;
    data.offset = (data.page - 1) * data.limit;
    let showRecipe = await selectDataRecipe(data);

    if (!showRecipe) {
      res
        .status(400)
        .json({ status: 400, message: `data recipe not found` });
    }
    res.status(200).json({
      status: 200,
      message: `data recipe found`,
      data: showRecipe.rows,
    });
  },

  getRecipeById: async (req, res, next) => {
    let id = req.params.id;
    let showRecipe = await selectDataRecipeById(id);
    console.log(showRecipe.rows);
    if (!showRecipe) {
      res.status(400).json({ status: 400, message: `data recipe not found` });
    }
    res
      .status(200)
      .json({ status: 200, message: `data found`, data: showRecipe.rows });
  },

  postDataRecipe: async (req, res, next) => {
    let data = {};
    data.title = req.body.title;
    data.ingredients = req.body.ingredients;
    data.photo = req.body.photo;
    data.users_id = req.body.users_id;

    let result = await insertDataRecipe(data);

    if (!result) {
      res
        .status(401)
        .json({ status: 400, message: `insert data recipe failed` });
    }
    res.status(200).json({ status: 200, message: `data inserted succesfully` });
  },

  deleteDataRecipe: async (req, res, next) => {
    let id = req.params.id;
    let result = await deleteDataRecipe(id);
    if (!result) {
      res
        .status(404)
        .json({ status: 404, message: `delete data recipe failed` });
    }

    res.status(200).json({
      status: 200,
      message: `delete data success`,
      data: `${id} deleted`,
    });
  },

  putDataRecipe: async (req, res, next) => {
    let result;
    let id = req.params.id;
    let showRecipe = await selectDataRecipeById(id);
    let currentRecipe = showRecipe.rows[0];
    let data = {
      title: req.body.title || currentRecipe.title,
      ingredients: req.body.ingredients || currentRecipe.ingredients,
      photo: req.body.photo || currentRecipe.photo,
      created_at: req.body.created_at || currentRecipe.created_at,
      users_id: req.body.users_id || currentRecipe.users_id,
      categories_id: req.body.categories_id || currentRecipe.categories_id,
    };
    result = await updateDataRecipe(id, data);
    if (!result) {
      res.status(404).json({ status: 404, message: `data input not found` });
    }
    let checkData = await selectDataRecipeById(id);
    console.log(`cek data = ${checkData}`);
    res.status(200).json({
      status: 200,
      message: `update data success`,
      data: checkData.rows,
    });
  },
};

module.exports = recipesController;
