const user = require('../../Models/userModel');
const trainer = require('../../Models/trainerModel')
//----------------------------admin-GET-USER-DETAILS-----------------------------
const traineeDetails  = async (req,res)=>{
    try {
        const userDetails = await user.findOne({_id:req.body.userId}).populate('trainer')
        return res.status(200).send({message:'get-user-details success',success:true,trainee:userDetails});
    } catch (error) {
        res.status(500).send({message:error,success:false})
        console.error(error);
    }
}

//-----------------HERE ADMIN CAN BLACK AND UNBLOCK USERS---------------------
const userBlockUnblock = async(req,res)=>{
    try {
        const trainee = await user.findOne({_id:req.body.userId})
        if(trainee.is_block){
          await user.findByIdAndUpdate({_id:trainee._id},{ $set:{
            is_block:false
          }})
          const traineeData = await user.findOne({_id:req.body.userId})
          return res.status(200).send({message:'Unblock the Trainee',success:true,trainee:traineeData})
        }else{
            await user.findByIdAndUpdate({_id:trainee._id},{$set:{
                is_block:true
            }})
            const traineeData = await user.findOne({_id:req.body.userId})
            return res.status(200).send({message:'Block the Trainee',success:true,trainee:traineeData})
        }
    } catch (error) {
        res.status(500).send({message:error,success:false})
        console.error(error);
    }
}



module.exports={
traineeDetails,
userBlockUnblock,

}