const express = require("express");
const ctrlContact = require("../../controller");
const router = express.Router();
const auth = require("./middleware/auth");
const validToken = required("./token/tokenValidate");


router.get("/", validToken, auth, ctrlContact.get);

router.get("/:id", validToken, auth, ctrlContact.getById); 

router.post("/", validToken, auth, ctrlContact.create);

router.delete("/:id",validToken, auth, ctrlContact.remove);

router.put("/:id",validToken, auth, ctrlContact.update);

router.patch("/:id/favorite",validToken, auth, ctrlContact.updateStatusFavorite);

router.post("/signup", ctrlContact.signupCtrl);

router.post("/login", ctrlContact.loginCtrl);

router.post("/logout", validToken, auth, ctrlContact.logoutCtrl);

module.exports = router;
