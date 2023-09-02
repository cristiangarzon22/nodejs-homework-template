const service = require("../service/index"); 
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const UserOwner = require("../service/schemas/UsersOwner");
var gravatar = require('gravatar');
const emailService = require("../service/EmailService");
const { nanoid } = require("nanoid");

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
  
  try {
    const result = await service.updateStatusContact( id, { name, email, phone, favorite });////
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
  const user = await service.getUserByEmail(email);
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }

  try {
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(email); 
    const newUser = new UserOwner({username, email, avatarURL ,verificationToken});
    newUser.setPassword(password);
    await newUser.save();
    emailService.sendEmail(verificationToken,email);
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

const loginCtrl = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserOwner.findOne({ email });
  if (!user || !user.comparePassword(password)) {
    Error("Email or password is wrong");
  }

  const payload = {
    id: user.id,
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

const verify = async (req, res, next) => { 
  const {email} = req.body;
  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "missing required field email",
    });
  }
  try {
    const user = await UserOwner.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify) {
      return res.status(400).json({ message: "Verification has already been passed" });
    }
    const verificationToken = nanoid();
    await service.updateUserVerificationToken(user._id, verificationToken);
    emailService.sendEmail(verificationToken,email);
} catch (e) {
  next(e);
}
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
  verify
};
