const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        require:true
    },
    trainer:{
        type:String,
        require:false,
    },
    lastname:{
        type:String,
        require:false,
    },
    age:{
      type:String,
      require:false,
    },
    height:{
        type:String,
        require:false,
    },
    weight:{
        type:String,
        require:false,
    },
    about:{
        type:String,
        require:false,
    },
    gender:{
        type:String,
        require:false,
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:false
    },
    profile:{
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

},{
    timestamps:true
})
module.exports = mongoose.model('user',userSchema);