const express = require("express");
const multer = require("multer");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;
const UserOwner = require("../../service/schemas/UsersOwner");


const ctrlContact = require("../../controller/index");
const auth = require("../../middleware/auth");

const router = express.Router();

const uploadDir = path.join(process.cwd(), "tmp");
const storeImage = path.join(process.cwd(), "./public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, uploadDir);
  },
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

const invalidatedTokens = new Set();

const validToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (invalidatedTokens.has(token)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unauthorized: Invalid token",
      data: "Unauthorized",
    });
  }

  next();
};

router.get("/avatars/:fileName", (req, res, next) => {
  const filePath = path.join(storeImage, req.params.fileName);
  res.download(filePath);
});

const processImageMiddleware = async (req, res, next) => {
  const { path: temporaryName } = req.file;

  try {
    const image = await Jimp.read(temporaryName);
    image.resize(250, Jimp.AUTO).write(temporaryName);
    next();
  } catch (err) {
    console.error("Error processing image:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.patch("/avatars", upload.single("picture"), processImageMiddleware, async (req, res, next) => {
  const { path: temporaryName, originalname } = req.file;
  const fileName = path.join(storeImage, originalname);

  try { 
    await fs.rename(temporaryName, fileName);
    const userId = req.user._id;
    const avatarURL = `public/avatars/${originalname}`;
    await UserOwner.findByIdAndUpdate(userId, { $set: { avatarURL } });
    res.json({ message: "File uploaded successfully", status: 200 });
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }
});

router.get("/", validToken, auth, ctrlContact.get);
router.get("/:id", validToken, auth, ctrlContact.getById);
router.post("/", validToken, auth, ctrlContact.create);
router.delete("/:id", validToken, auth, ctrlContact.remove);
router.put("/:id", validToken, auth, ctrlContact.update);
router.patch("/:id/favorite", validToken, auth, ctrlContact.updateStatusFavorite);
router.post("/signup", ctrlContact.signupCtrl);
router.post("/login", ctrlContact.loginCtrl);
router.post("/logout", validToken, auth, (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  invalidatedTokens.add(token);
  console.log(Array.from(invalidatedTokens));

  res.status(204).json({
    status: "success",
    code: 204,
    message: "Successfully logout",
    data: "success",
  });
});

module.exports = router;
