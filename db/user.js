const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    confirmPassword:String
})
module.exports=mongoose.model("data1",userSchema)