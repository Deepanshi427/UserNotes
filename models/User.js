const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {type:String , unique: true},
    password: String,
    role:{type: String, enum:["user" , "manager", "admin"], default :"user"},
    refreshTokken:{
        type: String,
        default: null
    }
});

module.exports = mongoose.model("User", userSchema);