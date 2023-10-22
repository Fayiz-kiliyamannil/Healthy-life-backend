
const User = require('../../Models/userModel');
const Trainer = require('../../Models/trainerModel')

//---------------------------------------------USER UPDATE THE PROFILE---------------------------

const updateProfile = async (req, res, next) => {
    try {
        const traienrInfo = await Trainer.findOne({ firstname: req.body.trainer })
        await User.findByIdAndUpdate({ _id: req.body._id }, {
            $set: {
                lastname: req.body.lastname,
                phone: req.body.phone,
                trainer: traienrInfo._id,
                about: req.body.about,
                profile: req.file.filename,
                gender: req.body.gender,
                age: req.body.age,
                weight: req.body.weight,
                height: req.body.height,
            }
        })

        if (!req.file.filename) return res.status(200).send({ message: 'profile Image is not selected', success: false })

        return res.status(200).send({ message: 'Update your Profile', success: true })
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        console.log(req.body.userId);
        const userData = await User.findOne({ _id: req.body.userId });
        return res.status(200).send({ message: 'get-user-data', success: true, user: userData });
    } catch (error) {
        next(error)
    }
}


const getTrainer = async (req, res, next) => {
    try {
        const trainerData = await Trainer.find({ is_block: false }).lean();
        return res.status(200).send({ message: 'get-Trainer-data', success: true, trainer: trainerData });
    } catch (error) {
        next(error)
    }
}

//----------------------   GET TRAINERS PROFILE ------------------------------------
const getTrainerProfile = async (req, res, next) => {
    try {
        console.log('---------------------------------', req.body);
        const trainerInfo = await Trainer.findOne({ _id: req.body.id })
        console.log(trainerInfo);
        return res.status(200).send({ message: "get-trainer-details success", success: true, trainer: trainerInfo })
    } catch (error) {
        next(error)
    }
}

//--------------------------------  USER PROFILE DETAILS-----------------------------------
const getProfile = async (req, res, next) => {
    try {
        const userData = await User.findOne({ _id: req.body.userId }).populate('trainer')
        return res.status(200).send({ message: 'get-user-info', success: true, user: userData })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    updateProfile,
    getUser,
    getTrainer,
    getProfile,
    getTrainerProfile,

}