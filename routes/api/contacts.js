const express = require('express')
const {listContacts,getContactById} = require("../../models/contacts");

const router = express.Router()

router.get('/', async (req, res, next) => {  
  const contacts = await listContacts();
  res.json(JSON.parse(contacts.toString()));
})

router.get('/:contactId', async (req, res, next) => {
  const {id} = req.params;
  const contact = await getContactById(id);
  //res.json(JSON.parse(contact.toString()));
  res.send(`<h1>Contacts</h1><h2>Contact id: ${contact}</h2>`);

})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
