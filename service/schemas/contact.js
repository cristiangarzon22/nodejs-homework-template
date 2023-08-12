const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bCrypt = require("bcryptjs");

const contact = new Schema({
  password: { 
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

contact.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

contact.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

const Contact = mongoose.model("contact", contact);
module.exports = Contact;


