const ApiResult = require("../middleware/error/ApiResult");
const { findUser, createUser } = require("./../model/userModel");
const { v4: uuidv4 } = require("uuid");
const argon2 = require("argon2");
const generateToken = require('../helpers/generateToken')
// const email = require("../middleware/email")

const UsersController = {
  registerUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password || !req.body.name) {
      next(ApiResult.badRequest(`Bad request, Email / Password / name missing`));
      return;
    }

    // console.log(req.body.email);

    let {
      rows: [users],
    } = await findUser(req.body.email);

    if (users) {
      next(ApiResult.unauthorized(`Email is registered, you may login.`));
      return;
    }

    let data = {
      id: uuidv4(),
      email: req.body.email,
      password: await argon2.hash(req.body.password),
      fullname: req.body.name,
    };

    let register = await createUser(data);

    if (!register) {
      next(ApiResult.unauthorized(`Registration failed`));
      return;
    }

    return next(ApiResult.createSuccess(`Registration successful`));
  },

  loginUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      next(ApiResult.badRequest(`Bad request, email / password missing.`));
      return;
    }

    let {
      rows: [users],
    } = await findUser(req.body.email);

    let verifyPassword = await argon2.verify(users.password, req.body.password);
    let data = users
    delete data.password
    let token = generateToken(data)

    if (verifyPassword) {
      users.token = token
      delete users.password;
      delete users.otp;
      delete users.verif;
      delete users.created_at;
      return next(ApiResult.success(`Login successful`,users));
    }

    return next(ApiResult.badRequest(`Login failed`));
  },
};

module.exports = UsersController;
