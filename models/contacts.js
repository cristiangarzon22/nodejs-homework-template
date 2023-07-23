const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const listContacts = async () => {
  const contactList = await fs.readFile("models/contacts.json");
  return JSON.parse(contactList.toString());
};

const getContactById = async (contactId) => { 
  const contactList = await listContacts();
  const filteredContact = contactList.find(
    (contact) => contact.id === contactId
  );
  if (!filteredContact) {
    return { message: "Not found" };
  }
  return filteredContact;
};

const removeContact = async (contactId) => {
  const contactList = await listContacts();
  const updatedContacts = contactList.filter((contact) => contact.id !== contactId);

  await fs.writeFile("models/contacts.json", JSON.stringify(updatedContacts));

  return true; // Devuelve true para indicar que el contacto fue eliminado con éxito
}



const addContact = async (body) => {
  const contactId = uuidv4();
  if (!body.name || !body.email || !body.phone) {
    return { error: true };
  }
  const fileData = await fs.promises.readFile('models/contacts.json', 'utf8');
  let contacts = JSON.parse(fileData);
  const newContact = {
    id: contactId,
    name: body.name,
    email: body.email,
    phone: body.phone,
  };
  contacts.push(newContact);
  await fs.promises.writeFile('models/contacts.json', JSON.stringify(contacts, null, 2));
  return newContact;
};

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
