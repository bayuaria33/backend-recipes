const {
  selectDataUser,
  insertDataUser,
  selectDataUserById,
  updateDataUser,
  deleteDataUser,
} = require("../model/userModel");

const usersController = {
  getAllUsers: async (req, res, next) => {
    let { searchBy, search, sortBy, sort } = req.query;

    let data = {
      searchBy: searchBy || "name",
      search: search || "",
      sortBy: sortBy || "name",
      sort: sort || "ASC",
    };
    data.page = parseInt(req.query.page) || 1;
    data.limit = parseInt(req.query.limit) || 5;
    data.offset = (data.page - 1) * data.limit;
    let showUser = await selectDataUser(data);
    if (!showUser) {
      res.status(400).json({ status: 400, message: `data user not found` });
    }

    res
      .status(200)
      .json({ status: 200, message: `data found`, data: showUser.rows });
  },

  getUserById: async (req, res, next) => {
    let id = req.params.id;
    let foundUser = null;
    let showUser = await selectDataUserById(id);
    showUser.rows.map((item) => {
      if (item.id == id) {
        foundUser = item;
      }
    });
    console.log(showUser.rows);
    if (!foundUser) {
      res.status(400).json({ status: 400, message: `data user not found` });
    }
    res
      .status(200)
      .json({ status: 200, message: `data found`, data: showUser.rows });
  },

  postDataUser: async (req, res, next) => {
    let data = {};
    data.name = req.body.name;
    data.email = req.body.email;
    data.phonenumber = req.body.phonenumber;
    data.password = req.body.password;

    let result = await insertDataUser(data);

    if (!result) {
      res.status(401).json({ status: 400, message: `data not input` });
    }
    res.status(200).json({ status: 200, message: `data inserted` });
  },

  putDataUser: async (req, res, next) => {
    // let data = {};
    let result;
    let id = req.params.id;
    let showUser = await selectDataUserById(id);
    let currentUser = showUser.rows[0];
    //cek if undefined
    let data = {
      name: req.body.name || currentUser.name,
      email: req.body.email || currentUser.email,
      phonenumber: req.body.phonenumber || currentUser.phonenumber,
      password: req.body.password || currentUser.password,
    };
    console.log(`data = `);
    console.log(data);
    console.log(req.body);
    result = await updateDataUser(id, data);
    if (!result) {
      res.status(404).json({ status: 404, message: `data input not found` });
    }

    let checkData = await selectDataUserById(id);
    console.log(`cek data =`);
    console.log(checkData.rows);
    res.status(200).json({
      status: 200,
      message: `update data success`,
      data: checkData.rows,
    });
  },

  deleteDataUser: async (req, res, next) => {
    let id = req.params.id;
    let result = await deleteDataUser(id);
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

module.exports = usersController;
