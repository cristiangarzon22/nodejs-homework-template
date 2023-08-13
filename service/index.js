const Contact = require("./schemas/contact");
 
const getAllContacts = async ({owner}) => { 
  return Contact.find({owner});
};
 
const getContactById = (id,owner) => {
  return Contact.findOne({ _id:id ,owner });
};

const createContact = ({ name, email, phone, favorite ,owner}) => {
  return Contact.create({ name, email, phone, favorite ,owner});
};

const updateContact = (id, fields, owner) => { 
  return Contact.findByIdAndUpdate(id, { owner, ...fields }, { new: true });
};

const removeContact = (id, owner) => {
  return Contact.findByIdAndRemove(id);
};


const updateStatusContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body, { new: true });
};


const getUserByEmail = async (email,owner) => {
  return Contact.findOne({ email ,owner});
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
  getUserByEmail,
};
