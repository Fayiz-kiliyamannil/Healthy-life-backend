
const User = require('../../Models/userModel');
const Trainer = require('../../Models/trainerModel')


const updateProfile = async (req, res) => {
    try {
        await User.findByIdAndUpdate({ _id: req.body._id }, {$set:{
            lastname: req.body.lastname,
            phone: req.body.phone,
            trainer: req.body.trainer,  
            about: req.body.about,
            profile:req.file.filename,
            gender: req.body.gender,
            age: req.body.age,
            weight: req.body.weight,
            height: req.body.height,
        }})

         if(!req.file.filename)  return res.status(200).send({ message: 'profile Image is not selected', success:false })

        return res.status(200).send({ message: 'Update your Profile', success:true })
    } catch (error) {
        res.status(500).send({ message: 'error in update profile', success: false })
        console.error(error);
    }
}

const getUser = async (req, res) => {
    try {
        console.log(req.body.userId);
        const userData = await User.findOne({ _id: req.body.userId });
        return res.status(200).send({ message: 'get-user-data', success: true, user: userData });
    } catch (error) {
        console.error(error);
    }
}

const getTrainer = async (req, res) => {
    try {
        const trainerData = await Trainer.find({}).lean();
        return res.status(200).send({ message: 'get-Trainer-data', success: true, trainer: trainerData });
    } catch (error) {
        console.error(error);
    }
}

const getProfile = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.body.userId })
        console.log(userData);
        return res.status(200).send({ message: 'get-user-info', success: true, user: userData })
    } catch (error) {
        res.status(500).send({ message: 'error in get-profile', success: false })
        console.error(error);
    }
}


module.exports = {
    updateProfile,
    getUser,
    getTrainer,
    getProfile,

}