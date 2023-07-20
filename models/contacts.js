const fs = require('fs/promises')

const listContacts = async () => {
   const list = await fs.readFile("models/contacts.json");
   return list;
}

const getContactById = async (contactId) => {
  const list = await listContacts();
  const filtering =  list.filter( (e) => e.id === contactId);
  return filtering;
}

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
