
const mongoose = require("mongoose");

const setSchema = mongoose.Schema({
    setName:{type:String},
    description:{type:String},
},{timestamps:true})

module.exports = mongoose.model("set", setSchema);