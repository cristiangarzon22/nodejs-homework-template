const express = require("express");
const ctrlContact = require("./controller/index"); /////
const router = express.Router();
const auth = require("./middleware/auth"); /////


const invalidatedTokens = new Set();

const validToken = (req, res, next) => {
   
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
  
    if (invalidatedTokens.has(token)) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unathorized: Invalid token",
        data: "Unathorized",
      });
    }
  
    next();
  };
  
 

router.get("/", validToken, auth, ctrlContact.get);

router.get("/:id", validToken, auth, ctrlContact.getById); 

router.post("/", validToken, auth, ctrlContact.create);

router.delete("/:id",validToken, auth, ctrlContact.remove);

router.put("/:id",validToken, auth, ctrlContact.update);

router.patch("/:id/favorite",validToken, auth, ctrlContact.updateStatusFavorite);

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
