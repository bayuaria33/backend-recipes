const { findUser, createUser } = require("./../model/userModel");
const { v4: uuidv4 } = require("uuid");
const argon2 = require("argon2");
const ApiError = require("../middleware/error/ApiError");

const UsersController = {
  registerUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password || !req.body.name) {
      d
    }

    // console.log(req.body.email);

    let {
      rows: [users],
    } = await findUser(req.body.email);

    if (users) {
        next(ApiError.unauthorized(`Email is registered, you may login.`));
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
      next(ApiError.unauthorized(`Registration failed`));
      return;
    }

    return next(ApiError.createSuccess(`Registration successful`)); 
  },

  loginUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        next(ApiError.badRequest(`Bad request, email / password missing.`));
        return;
    }

    let {
      rows: [users],
    } = await findUser(req.body.email);

    let verifyPassword = await argon2.verify(users.password, req.body.password);

    if (verifyPassword) {
      delete users.password;
      delete users.otp;
      delete users.verif;
      delete users.created_at;
      return next(ApiError.success(`Login successful`));
    }

    return next(ApiError.badRequest(`Login failed`));;
  },
};

module.exports = UsersController;
