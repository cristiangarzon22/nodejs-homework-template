const fs = require('fs/promises')
const { v4: uuidv4 } = require('uuid');

const listContacts = async () => {
  const contactList = await fs.readFile("models/contacts.json");
  return JSON.parse(contactList.toString());
};

const getContactById = async (contactId) => { 
  const contactList = await listContacts();
  const filteredContact = contactList.filter(
    (contact) => contact.id === contactId
  );
  return filteredContact;
};

const removeContact = async (contactId) => {
  let validation = false;
  const contactList = await listContacts();
  const contacts = contactList.filter(
    (contact) => contact.id !== contactId
  );
  if(contacts){
    validation = true;
    return validation;
  }
  return fs.writeFile("models/contacts.json",JSON.stringify(contacts));  
}

const addContact = async (body) => {
  let error = null;
  const contactId = uuidv4();
  if (!body.name || !body.email || !body.phone) {    
    error = true;
    return error;
  }
  const newcontact = {
    id: contactId,
    name: body.name,
    email: body.email,
    phone: body.phone,
  };
  fs.appendFile("models/contacts.json",newcontact);
  return newcontact;
}

const updateContact = async (contactId, body) => {
  const contactList = await listContacts();
  const contactIndex = contactList.findIndex((contact) => contact.id === contactId);
  if (contactIndex === -1) {
    throw new Error('Contacto no encontrado');
  }
  contactList[contactIndex].name = body.name;
  contactList[contactIndex].email = body.email;
  contactList[contactIndex].phone = body.phone;
  
  await fs.writeFile("models/contacts.json", JSON.stringify(contactList));

  return contactList[contactIndex];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
