const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, maxLength: 8, minLength: 4},
    lastName: {type: String, required: false, maxLength: 15, minLength: 4},
    location: {type: String , required: false},
    email: {type: String, required : true, unique: true},
    password: {type: String, required: true},
    age: {type: Number, required: false, min: [18, "Not a valid age"], max: [50, "Age not eligible"]},
    skills: {type: [], required: false}
})

const UserModel = mongoose.model("User", userSchema)

module.exports = {UserModel}