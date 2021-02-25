let mongosee = require('mongoose');
let userSchema = new mongosee.Schema({
    phoneNumber:{
        type:String,
        required:true
    },
    fullName: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    passWord: {
        type: String,
        required: true
    },
    avatar: {
        type:String,
        required:true,
        default:'images/img.png'
    }
})
module.exports = mongosee.model('User', userSchema,'user');
