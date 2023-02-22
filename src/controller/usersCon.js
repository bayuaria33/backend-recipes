const ApiResult = require("../middleware/error/ApiResult");

const {
  selectDataUser,
  insertDataUser,
  selectDataUserById,
  updateDataUser,
  deleteDataUser,
} = require("../model/userModel");

const usersController = {
  getAllUsers: async (req, res, next) => {
    try {
      let { searchBy, search, sortBy, sort } = req.query;
      let data = {
        searchBy: searchBy || "name",
        search: search || "",
        sortBy: sortBy || "name",
        sort: sort || "DESC",
      };
      data.page = parseInt(req.query.page) || 1;
      data.limit = parseInt(req.query.limit) || 10;
      data.offset = (data.page - 1) * data.limit;
      let showUser = await selectDataUser(data);
      if (showUser.rows.length === 0) {
        next(
          ApiResult.badRequest(
            `Data not Found, user with ${data.searchBy} = ${data.search} does not exist`
          )
        );
        return;
      }
      res
        .status(200)
        .json({ status: 200, message: `data found`, data: showUser.rows });
    } catch (error) {
      next(ApiResult.badRequest(`Error, message: ${error.message}`));
    }
  },

  getUserById: async (req, res, next) => {
    try {
      let id = req.params.id;
      let foundUser = null;
      //guard clause
      if (isNaN(id)) {
        next(ApiResult.badRequest(`Bad Request, id is not a number`));
        return;
      }
      let showUser = await selectDataUserById(id);
      showUser.rows.map((item) => {
        if (item.id == id) {
          foundUser = item;
        }
      });
      console.log(showUser.rows);
      if (!foundUser) {
        next(ApiResult.badRequest(`Bad Request, data user not found`));
        return;
      }
      res
        .status(200)
        .json({ status: 200, message: `data found`, data: showUser.rows });
    } catch (error) {
      next(ApiResult.badRequest(`Error, message = ${error.message}`));
    }
  },
  //getuser versi then catch
  // getUserById: async (req, res, next) => {
  //   if (isNaN(req.params.id)) {
  //     next(ApiResult.badRequest(`Bad Request, id is not a number`));
  //   }
  //   await selectDataUserById(req.params.id).then((result)=>{
  //     if(!result.rows[0]){
  //       next(ApiResult.badRequest(`Data not found`));
  //     }
  //     res
  //     .status(200)
  //     .json({ status: 200, message: `Data found`, data: result.rows });
  //   }).catch((error)=>{
  //     next(ApiResult.badRequest(error.message));
  //   })
  // },

  postDataUser: async (req, res, next) => {
    try {
      let data = {};
      data.name = req.body.name;
      data.email = req.body.email;
      data.phonenumber = req.body.phonenumber;
      data.password = req.body.password;
      let result = await insertDataUser(data);
      if (!result) {
        next(ApiResult.badRequest(`Failed to insert user data`));
        return;
      }
      res.status(200).json({ status: 200, message: `Data user inserted` });
    } catch (error) {
      next(ApiResult.badRequest(error.message));
    }
  },

  putDataUser: async (req, res, next) => {
    try {
      let id = req.params.id;
      let showUser = await selectDataUserById(id);
      let currentUser = showUser.rows[0];
      if (!currentUser) {
        next(ApiResult.badRequest(`User with id ${id} does not exist`));
        return;
      }
      //cek if undefined
      let data = {
        name: req.body.name || currentUser.name,
        email: req.body.email || currentUser.email,
        phonenumber: req.body.phonenumber || currentUser.phonenumber,
        password: req.body.password || currentUser.password,
      };
      result = await updateDataUser(id, data);
      if (!result) {
        next(ApiResult.badRequest(`Update data user failed`));
        return;
      }
      let checkData = await selectDataUserById(id);
      res.status(200).json({
        status: 200,
        message: `update data success`,
        data: checkData.rows,
      });
    } catch (error) {
      next(ApiResult.badRequest(error.message));
    }
  },

  deleteDataUser: async (req, res, next) => {
    try {
      let id = req.params.id;
      let showUser = await selectDataUserById(id);
      let currentUser = showUser.rows[0];
      if (!currentUser) {
        next(ApiResult.badRequest(`User with id ${id} does not exist`));
        return;
      }
      let result = await deleteDataUser(id);
      if (!result) {
        next(ApiResult.badRequest(`Delete data user failed`));
        return;
      }
      res.status(200).json({
        status: 200,
        message: `delete data user successful`,
        data: `${id} deleted`,
      });
    } catch (error) {
      next(ApiResult.badRequest(error.message));
    }
  },
};

module.exports = usersController;
