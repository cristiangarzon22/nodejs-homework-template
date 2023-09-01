const Contact = require("./schemas/contact");
const UserOwner = require("./schemas/UsersOwner");

const getAllContacts = ({owner}) => { 
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

const removeContact = (id) => {
  return Contact.findByIdAndRemove(id);
};

const updateStatusContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body, { new: true });
};

const getUserByEmail = (email,owner) => {
  return Contact.findOne({ email ,owner});
};

const getUserByVerificationToken = async (token) => {
  return UserOwner.findOne({ verificationToken: token });
};

const verifyUser = (id) => {
    return UserOwner.updateOne({ _id: id }, { verify: true, verificationToken: null });
};


module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
  getUserByEmail,
  getUserByVerificationToken,
  verifyUser,
};
