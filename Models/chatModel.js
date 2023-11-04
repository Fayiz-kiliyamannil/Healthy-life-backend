const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trainer'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        require: true
    },
    sender: {
        type: String,
        require: true
    },
    time:{
        type: String,
        require:true,
    }


},
{
    timestamps:true, 
})

module.exports = mongoose.model('chat',blogSchema)