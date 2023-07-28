const express = require("express");
const ctrlContact = require("../controller");
const router = express.Router();

router.get("/", ctrlContact.get);

router.get("/:contactId", ctrlContact.getById);

router.post("/", ctrlContact.create);

router.delete("/:contactId", ctrlContact.remove);

router.put("/:contactId", ctrlContact.update);

module.exports = router;
