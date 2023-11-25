const user = require('../../Models/userModel');
const trainer = require('../../Models/trainerModel')

//----------------------------admin-GET-USER-DETAILS-----------------------------
const traineeDetails  = async (req,res,next)=>{
    try {
        const userDetails = await user.findOne({_id:req.body.id}).populate('trainer')
        return res.status(200).send({message:'get-user-details success',success:true,trainee:userDetails});
    } catch (error) {
       next(error)
    }
}

//-----------------HERE ADMIN CAN BLACK AND UNBLOCK USERS---------------------
const userBlockUnblock = async(req,res,next)=>{
    try {
        const trainee = await user.findOne({_id:req.body.id})
        if(trainee.is_block){
          await user.findByIdAndUpdate({_id:trainee._id},{ $set:{
            is_block:false
          }})
          const traineeData = await user.findOne({_id:req.body.id})
          return res.status(200).send({message:'Unblock the Trainee',success:true,trainee:traineeData})
        }else{
            await user.findByIdAndUpdate({_id:trainee._id},{$set:{
                is_block:true
            }})
            const traineeData = await user.findOne({_id:req.body.id})
            return res.status(200).send({message:'Block the Trainee',success:true,trainee:traineeData})
        }
    } catch (error) {
        next(error)
    }
}



module.exports={
traineeDetails,
userBlockUnblock,

}