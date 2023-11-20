const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    trainerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'trainer'
        
    },
    rating:{
        type:String,
        require:true
    }
    

})

module.exports = mongoose.model('rating',ratingSchema)