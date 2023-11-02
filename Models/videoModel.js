const mongoose = require('mongoose');


const videoSchema = new mongoose.Schema({

    video:{
        type:String,
        require:true,
    },
    trainerId:{
        type:mongoose.Schema.Types.ObjectId,ref:'trainer'
    },
    header:{
        type:String,
        require:true,
    },
    note:{
        type:String,
        require:true,
    },
    uploadDate:{
        type:String,
        require:true
    }


},{
    timestamps:true
})

module.exports = mongoose.model('video',videoSchema)