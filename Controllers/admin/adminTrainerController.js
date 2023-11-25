const trainer = require("../../Models/trainerModel");
const Rating = require('../../Models/trainerRatingModel');



const allTrainerDetails = async (req, res, next) => {
  try {
    const { _limit, _page } = req.query;
    const totalTrainer = await trainer.countDocuments({ is_verified: true })
    const noOfPage = Math.ceil(totalTrainer / _limit)
    const trainerData = await trainer.find({ is_verified: true })
      .limit(_limit).skip(_limit * (_page - 1)).lean();

    return res.status(200).send({
      message: "fetch  all-trainer data",
      success: true,
      trainer: trainerData,
      noOfPage,
    });
  } catch (error) {
    next(error)
  }
};

//--------------------------GET NEW TRAINER DATA---------------------
const newTrainers = async (req, res, next) => {
  try {
    const newTrainerData = await trainer.find({ is_verified: false }).lean();
    return res.status(200).send({
      message: "fetch new-trainer data",
      success: true,
      newTrainer: newTrainerData,
    });
  } catch (error) {
    next(error)
  }
};
//-------------------GET NEW TRAINER PROFILE-----------------------------

const trainersDetails = async (req, res, next) => {
  try {
    const trainerData = await trainer.findOne({ _id: req.body.id });
    const totalRating = await Rating.find({ trainerId: req.body.id })
    const countRating = await Rating.countDocuments({ trainerId: req.body.id })

    const rating = totalRating.reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.rating);
    }, 0)
    const avgRating = Math.floor(rating / countRating)


    return res
      .status(200)
      .send({
        message: "get new trainer profile",
        success: true,
        trainer: trainerData,
        noOfRating: countRating,
        rating: avgRating
      });
  } catch (error) {
    next(error)
  }
};


const confirmTrainer = async (req, res, next) => {
  try {
    await trainer.updateOne({ _id: req.body.trainerId }, { is_verified: true });
    const trainerData = await trainer.find({ is_verified: false }).lean();
    return res.status(200).send({
      message: "confirm-Trainer",
      success: true,
      trainer: trainerData,
    });
  } catch (error) {
    next(error)
  }
};

const deleteTrainer = async (req, res, next) => {
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
    next(error)
  }
};



//---------------HERE ADMIN CAN BLOCK AND UNBLOCK TRAINERS-------------------------

const trainerBlockUnblock = async (req, res, next) => {
  try {
    const trainerData = await trainer.findOne({ _id: req.body.id })
    if (trainerData.is_block) {
      await trainer.findByIdAndUpdate({ _id: trainerData._id }, {
        $set: {
          is_block: false
        }
      })
      const Trainer = await trainer.findOne({ _id: req.body.id })
      return res.status(200).send({ message: 'Unblock the Trainer', success: true, trainer: Trainer })
    } else {
      await trainer.findByIdAndUpdate({ _id: trainerData._id }, {
        $set: {
          is_block: true
        }
      })
      const Trainer = await trainer.findOne({ _id: req.body.id })
      return res.status(200).send({ message: 'Block the Trainer', success: true, trainer: Trainer })
    }

  } catch (error) {
    next(error)
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

