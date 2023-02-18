const {
    selectDataCategory,
    insertDataCategory,
    selectDataCategoryById,
    updateDataCategory,
    deleteDataCategory,
  } = require("../model/categoryModel");
  
  const categoriesController = {
    getAllCategories: async (request, response, next) => {
      let showCategory = await selectDataCategory();
      if (!showCategory) {
        response
          .status(400)
          .json({ status: 400, message: `data category not found` });
      }
  
      response
        .status(200)
        .json({ status: 200, message: `data found`, data: showCategory.rows });
    },
  
    getCategoryById: async (req, res, next) => {
      let id = req.params.id;
      // let foundCategory = null;
      let showCategory = await selectDataCategoryById(id);
      console.log(showCategory.rows);
      if (!showCategory) {
        res.status(400).json({ status: 400, message: `data category not found` });
      }
      res
        .status(200)
        .json({ status: 200, message: `data found`, data: showCategory.rows });
    },
  
    postDataCategory: async (req, res, next) => {
      let data = {};
      data.category_name = req.body.category_name;
  
      let result = await insertDataCategory(data);
  
      if (!result) {
        res.status(401).json({ status: 400, message: `data not input` });
      }
      res.status(200).json({ status: 200, message: `data inserted` });
    },
  
    putDataCategory: async (req, res, next) => {
      let data = {};
      let result;
      let id = req.params.id;
      let showCategory = await selectDataCategoryById(id);
      let currentCategory = showCategory.rows[0];
      //cek if value is undefined
      req.body.category_name
        ? (data.category_name = req.body.category_name)
        : (data.category_name = currentCategory.category_name);
      result = await updateDataCategory(id, data);
      if (!result) {
        res.status(404).json({ status: 404, message: `data input not found` });
      }
      let checkData = await selectDataCategoryById(id);
      console.log(`cek data = ${checkData}`);
      res.status(200).json({
        status: 200,
        message: `update data success`,
        data: checkData.rows,
      });
    },
  
    deleteDataCategory: async (req, res, next) => {
      let id = req.params.id;
      let result = await deleteDataCategory(id);
      if (!result) {
        res.status(404).json({ status: 404, message: `delete data failed` });
      }
  
      res.status(200).json({
        status: 200,
        message: `delete data success`,
        data: `${id} deleted`,
      });
    },
  };
  
  module.exports = categoriesController;
  