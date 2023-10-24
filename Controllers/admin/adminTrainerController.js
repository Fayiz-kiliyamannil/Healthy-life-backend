const trainer = require("../../Models/trainerModel");

const allTrainerDetails = async (req, res) => {
  try {
    const trainerData = await trainer.find({ is_verified: true }).lean();
    return res.status(200).send({
      message: "fetch  all-trainer data",
      success: true,
      trainer: trainerData,
    });
  } catch (error) {
    console.error(error);
  }
};

//--------------------------GET NEW TRAINER DATA---------------------
const newTrainers = async (req, res) => {
  try {
    const newTrainerData = await trainer.find({ is_verified: false }).lean();
    return res.status(200).send({
      message: "fetch new-trainer data",
      success: true,
      newTrainer: newTrainerData,
    });
  } catch (error) {
    res.status(500).send({ message: "error in  newr_Trainer", success: false });
    console.error(error);
  }
};
//-------------------GET NEW TRAINER PROFILE-----------------------------

const trainersDetails = async (req, res) => {
  try {
    const trainerData = await trainer.findOne({ _id: req.body.id });
    return res
      .status(200)
      .send({
        message: "get new trainer profile",
        success: true,
        trainer: trainerData,
      });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error in new trainer Details", success: false });
    console.error(error);
  }
};


const confirmTrainer = async (req, res) => {
  try {
    await trainer.updateOne({ _id: req.body.trainerId }, { is_verified: true });
    const trainerData = await trainer.find({ is_verified: false }).lean();
    return res.status(200).send({
      message: "confirm-Trainer",
      success: true,
      trainer: trainerData,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error in  confirm_trainer", success: false });
    console.error(error);
  }
};

const deleteTrainer = async (req, res) => {
  try {
    await trainer.deleteOne({ _id: req.body.trainerId });
    const newTrainerData = await trainer.find({ is_verified: false }).lean();
    const trainerData = await trainer.find({ is_verified: false }).lean();
    return res.status(200).send({
      message: "Delete Trainer ",
      success: true,
      trainer: trainerData,
      newTrainer: newTrainerData,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error in  deleteTrainer", success: false });
    console.error(error);
  }
};



//---------------HERE ADMIN CAN BLOCK AND UNBLOCK TRAINERS-------------------------

const trainerBlockUnblock = async(req,res)=>{
  try {
      const trainerData = await trainer.findOne({_id:req.body.id}) 
      if(trainerData.is_block){
          await trainer.findByIdAndUpdate({_id:trainerData._id},{$set:{
              is_block:false
          }})
          const Trainer = await trainer.findOne({_id:req.body.id}) 
          return res.status(200).send({message:'Unblock the Trainer',success:true,trainer:Trainer})
      }else{
          await trainer.findByIdAndUpdate({_id:trainerData._id},{$set:{
              is_block:true
          }})
          const Trainer = await trainer.findOne({_id:req.body.id}) 
          return res.status(200).send({message:'Block the Trainer',success:true,trainer:Trainer})
      }

  } catch (error) {
      res.status(500).send({message:error,success:false})
      console.error(error);
  }
}

module.exports = {
  allTrainerDetails,
  newTrainers,
  confirmTrainer,
  deleteTrainer,
  trainersDetails,
  trainerBlockUnblock,
};

