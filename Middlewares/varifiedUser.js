const user = require('../Models/userModel');

module.exports = async (req,res,next) =>{
  try {
    const {userId} = req.body
    const userData = await user.findOne({_id:userId})
    if(userData.is_block){
        return res.status(200).send({message:'user blocked',success:false})
    }else{
        next();
    }
  } catch (error) {
     return res.status(404).send({message:error.meessge,success:false})
  }
   
}
