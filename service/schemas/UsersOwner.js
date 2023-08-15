const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bCrypt = require("bcryptjs");

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token: {
        type: String,
        default: null
    }
}, {versionKey: false, timestamps: true});

userSchema.methods.setPassword = function(password){
    this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function(password){
    return bCrypt.compareSync(password, this.password);
}

const UserOwner = mongoose.model("user", userSchema);
module.exports = UserOwner;