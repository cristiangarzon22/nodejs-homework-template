const fs = require('fs/promises')

const listContacts = async () => {
   fs.readFile("./contacts.json").then(async (data) => {
     const response = await data.json();
     console.log(response);
   })
}

const getContactById = async (contactId) => {}

const removeContact = async (contactId) => {}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
