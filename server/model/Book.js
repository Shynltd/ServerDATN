let mongosee = require('mongoose');
let bookSchema = new mongosee.Schema({
    idUser:{
        type:String,
        required:true
    },
    timeBook: {
        type:String,
        required:true
    },
    status: {
        type:String,
        required:true,
        default:"A"
    }
})
module.exports = mongosee.model('Book', bookSchema,'book');
