const ApiError = require("../middleware/error/ApiError");

const {
  selectDataCategory,
  insertDataCategory,
  selectDataCategoryById,
  updateDataCategory,
  deleteDataCategory,
} = require("../model/categoryModel");

const categoriesController = {
  getAllCategories: async (req, res, next) => {
    try {
      let { searchBy, search, sortBy, sort } = req.query;
      let data = {
        searchBy: searchBy || "category_name",
        search: search || "",
        sortBy: sortBy || "category_name",
        sort: sort || "ASC",
      };
      data.page = parseInt(req.query.page) || 1;
      data.limit = parseInt(req.query.limit) || 10;
      data.offset = (data.page - 1) * data.limit;
      let showCategory = await selectDataCategory(data);
      if (showCategory.rows.length === 0) {
        next(
          ApiError.badRequest(
            `Data not Found, category with ${data.searchBy} = ${data.search} does not exist`
          )
        );
        return;
      }
      res
        .status(200)
        .json({ status: 200, message: `data found`, data: showCategory.rows });
    } catch (error) {
      next(ApiError.badRequest(`Error, message = ${error.message}`));
    }
  },

  getCategoryById: async (req, res, next) => {
    try {
      let id = req.params.id;
      let foundCategory = null;
      let showCategory = await selectDataCategoryById(id);
      showCategory.rows.map((item) => {
        if (item.id == id) {
          foundCategory = item;
        }
      });
      console.log(showCategory.rows);
      if (!foundCategory) {
        next(ApiError.badRequest(`Bad request, data category not found`));
        return;
      }
      res
        .status(200)
        .json({ status: 200, message: `data found`, data: showCategory.rows });
    } catch (error) {
      next(ApiError.badRequest(`Error, message = ${error.message}`));
    }
  },

  postDataCategory: async (req, res, next) => {
    try {
      let data = {};
      data.category_name = req.body.category_name;
      let result = await insertDataCategory(data);
      if (!result) {
        next(ApiError.badRequest(`Failed to insert category data`));
        return;
      }
      res.status(200).json({ status: 200, message: `data inserted` });
    } catch (error) {
      next(ApiError.badRequest(`Error, message = ${error.message}`));
    }
  },

  putDataCategory: async (req, res, next) => {
    try {
      let result;
      let id = req.params.id;
      let showCategory = await selectDataCategoryById(id);
      let currentCategory = showCategory.rows[0];
      //cek if value is undefined
      let data = {
        category_name: req.body.category_name || currentCategory.category_name,
      };
      result = await updateDataCategory(id, data);
      if (!result) {
        next(ApiError.badRequest(`Update data category failed`));
        return;
      }
      let checkData = await selectDataCategoryById(id);
      res.status(200).json({
        status: 200,
        message: `update data category success`,
        data: checkData.rows,
      });
    } catch (error) {
      next(ApiError.badRequest(`Error, message = ${error.message}`));
    }
  },

  deleteDataCategory: async (req, res, next) => {
    try {
      let id = req.params.id;
      let showCategory = await selectDataCategoryById(id);
      let currentCategory = showCategory.rows[0];
      if (!currentCategory) {
        next(ApiError.badRequest(`Category with id ${id} does not exist`));
        return;
      }
      let result = await deleteDataCategory(id);
      if (!result) {
        next(ApiError.badRequest(`Delete data category failed`));
        return;
      }
      res.status(200).json({
        status: 200,
        message: `delete data success`,
        data: `${id} deleted`,
      });
    } catch (error) {
      next(ApiError.badRequest(`Error, message = ${error.message}`));
    }
  },
};

module.exports = categoriesController;
