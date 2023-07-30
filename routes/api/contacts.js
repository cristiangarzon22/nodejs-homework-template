const express = require("express");
const ctrlContact = require("../../controller");
const router = express.Router();

router.get("/", ctrlContact.get);

router.get("/:Id", ctrlContact.getById); 

router.post("/", ctrlContact.create);

router.delete("/:Id", ctrlContact.remove);

router.put("/:Id", ctrlContact.update);

module.exports = router;
