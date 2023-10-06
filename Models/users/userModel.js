const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:false
    },
    profileImage:{
      type:String,
      require:false
    },

    password:{
        type:String,
        require:true,
    },
    is_block:{
        type:Boolean,
        default:false,
    }



})
module.exports = mongoose.model('user',userSchema);