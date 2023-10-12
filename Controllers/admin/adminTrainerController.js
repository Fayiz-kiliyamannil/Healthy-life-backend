const trainer = require('../../Models/trainerModel');

const allTrainerDetails = async (req,res)=>{
    try {
      const trainerData = await trainer.find({is_verified:true}).lean()
      console.log(trainerData);
       return res.status(200).send({message:"fetch  all-trainer data",success:true ,trainer:trainerData})

    } catch (error) {
        console.log(error);
    }
}


const  blockTrainer = async(req,res)=>{
    try {
          await trainer.updateOne({_id:req.body.trainerId},{is_block:true});
          const trainerData = await trainer.find({is_verified:true}).lean()
        return  res.status(200).send({message:`blocked Trainer `,success:true ,trainer:trainerData})
    } catch (error) {
         res.status(500).send({message:'error in block-Trainer',success:false})
        console.log(error);
    }
}

const unBlockTrainer = async(req,res)=>{
    try {
        await trainer.updateOne({_id:req.body.trainerId},{is_block:false});
        const trainerData = await trainer.find({is_verified:true}).lean()
        return res.status(200).send({message:`unblock Trainer `,success:true,trainer:trainerData})
    } catch (error) {
        res.status(500).send({message:'error in  unblock-Trainer',success:false})
        console.error(error);
    }
}


const newTrainers = async (req,res)=>{
    try {
        const newTrainerData =  await trainer.find({is_verified:false}).lean()
        return res.status(200).send({message:'fetch new-trainer data',success:true,newTrainer:newTrainerData})
    } catch (error) {
        res.status(500).send({message:'error in  newr_Trainer',success:false})
        console.error(error);
    }
}

const  confirmTrainer  = async(req,res)=>{
    try {
         await  trainer.updateOne({_id:req.body.trainerId},{is_verified:true})
         const trainerData =  await trainer.find({is_verified:false}).lean()
         return res.status(200).send({message:'confirm-Trainer',success:true ,trainer:trainerData});
    } catch (error) {
        res.status(500).send({message:'error in  confirm_trainer',success:false})
        console.error(error);  
    }
}

const deleteTrainer = async(req,res)=>{
    try {
        await trainer.deleteOne({_id:req.body.trainerId});
        const newTrainerData =  await trainer.find({is_verified:false}).lean()
        const trainerData =  await trainer.find({is_verified:false}).lean()
        return res.status(200).send({message:'Delete Trainer ',success:true, trainer:trainerData , newTrainer:newTrainerData})
    } catch (error) {
        res.status(500).send({message:'error in  deleteTrainer',success:false})
        console.error(error);  
    }
}




module.exports={
    allTrainerDetails,
    blockTrainer,
    unBlockTrainer,
    newTrainers,
    confirmTrainer,
    deleteTrainer,
} 