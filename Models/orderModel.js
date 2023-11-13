const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
    },
    price:{
        type:String,
        require:true
    },
    proStartIn:{
        type:String,
        require:true
    },
    proEndIn:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    noOfMonth:{
        type:String,
        require:true,
    },
    orderId:{
        type:String,
        require:true,
    }

},{
    timestamps:true
})

module.exports = mongoose.model('order',orderSchema)