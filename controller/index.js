const service = require("../service/index"); 
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const get = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const results = await service.getAllContacts({owner}); 
    res.json({
      status: "success", 
      code: 200,
      data: {
        data: results,
      },
    });
  } catch (error) {
    console.error("ha sucedido un error",error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const owner = req.user._id;
  try {
    const result = await service.getContactById(id,owner);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: {
          data: result,
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Cat not found by id ${id}`,
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  const owner = req.user._id;
  try {
    const result = await service.createContact({ name, email, phone, favorite,owner });

    res.status(201).json({
      status: "success",
      code: 201,
      data: { data: result },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  const owner = req.user._id;
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;

  try {
    const result = await service.updateContact(id, { name, email, phone, favorite,owner });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { data: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Cat not found by id ${id}`,
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next();
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  const owner = req.user._id;
  try {
    const result = await service.removeContact(id,owner);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { data: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Cat not found by id ${id}`,
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next();
  }
};
//mpa
const updateStatusFavorite = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  const owner = req.user._id;
  try {
    const result = await service.updateStatusContact( id, { name, email, phone, favorite ,owner});////
    if (result) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: { data: result },
      });
    } else {
      res.status(400).json({
        status: "error",
        code: 400,
        message: "missing field favorite",
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next();
  }
};

const signupCtrl = async (req, res, next) => {
  const { username, email, password } = req.body;
  const owner = req.user._id;
  const user = await getUserByEmail(email);
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }

  try {
    const newUser = new User({ username, email });
    newUser.setPassword(password);
    await newUser.save();

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (e) {
    next(e);
  }
};

const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  const owner = req.user._id;
  const user = await service.getUserByEmail(email,owner);

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
  updateStatusFavorite,
  signupCtrl,
  loginCtrl,
};
