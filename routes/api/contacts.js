const express = require('express')
const {listContacts,getContactById,removeContact,addContact,updateContact} = require("../../models/contacts");
const Joi = require('joi');

const router = express.Router()

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {  
  const contacts = await listContacts();
  res.json(contacts);
})

router.get("/:contactId", async (req, res, next) => {
  const results = await getContactById(req.params.contactId); 
  if (results.length === 0) {
    res.status(404).json({ message: "Not found" });
  }
  res.json(results);
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newContact = await addContact(req.body);

    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
});


router.delete('/:contactId', async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);
    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ message: 'This contact was deleted' });
  } catch (err) {
    next(err);
  }
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const update = {
    name,
    email,
    phone
  }

  try {
    const { error } = contactSchema.validate(update);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedContact = await updateContact(contactId, update);
    res.status(200).json(updatedContact);
  } catch (err) {
    next(err);
  }
});

module.exports = router
