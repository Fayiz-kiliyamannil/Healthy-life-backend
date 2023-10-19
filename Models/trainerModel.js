const mongoose = require('mongoose');

const trainerSchema = mongoose.Schema({
    firstname: {
        type: String,
        require: true,
    },
    lastname: {
        type: String,
        require: false,
    },
    age: {
        type: String,
        require: false,
    },
    height: {
        type: String,
        require: false,
    },
    specilized:{
        type:String,
        require:false,
    },
    weight: {
        type: String,
        require: false,
    },
    about: {
        type: String,
        require: false,
    },
    gender: {
        type: String,
        require: false,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String, 
        require: true
    },
    profile: {
        type: String,
        require: false
    },
    is_block: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    adress: {
        type: String,
    },




}, {
    timestamps: true
})

module.exports = mongoose.model('trainer', trainerSchema);