const express = require('express')
const {listContacts,getContactById,removeContact,addContact,updateContact} = require("../../models/contacts");

const router = express.Router()

router.get('/', async (req, res, next) => {  
  const contacts = await listContacts();
  res.json(contacts);
})

router.get("/:contactId", async (req, res, next) => {
  const results = await getContactById(req.params.contactId); 
  if (results.length === 0) {
    res.status(404).json({ message: "Not found" });
  }
  res.json(results[0]);
});

router.post('/', async (req, res, next) => {
  const newContact = await addContact(req.body);
  if(error){
    res.status(400).json({"message": "missing required name field"});
  }
  res.status(201).json(newContact);
})

router.delete("/:contactId", async (req, res, next) => {
  const result = await removeContact(req.params.contactId);
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ message: "This contact was deleted" });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
  const { contactId } = req.params;
  const { name, email ,phone } = req.body;
  const update = {
    name,
    email,
    phone 
  }
  if (!update.name || !update.email || !update.phone) {
    res.status(400).json({"message": "missing fields"});
  }else{
    const updateContacts = await updateContact(update.json(),contactId);
    return res.status(200).json(updateContacts);
  }

})

module.exports = router
