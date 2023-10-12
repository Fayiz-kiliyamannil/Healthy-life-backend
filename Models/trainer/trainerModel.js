const mongoose = require('mongoose');

const trainerSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    profile:{
        type:String,
        require:false
    },
    is_block:{
        type:Boolean,
        default:false
    },
    is_verified:{
        type:Boolean,
        default:false,
    },
     adress:{
        type:String,
     },

},{
    timestamps:true
})

module.exports = mongoose.model('trainer',trainerSchema);