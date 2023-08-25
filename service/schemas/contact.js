const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contact = new Schema({
  name: { 
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
   phone: { 
    type: String,
    required: [true, 'number is required'],
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },////////////
  favorite: {
    type: Boolean,
    default: false,
  }
}, {versionKey: false, timestamps: true});

const Contact = mongoose.model("contact", contact);
module.exports = Contact;


