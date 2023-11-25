
const User = require('../../Models/userModel');
const Trainer = require('../../Models/trainerModel');
const Order = require('../../Models/orderModel')
const todayDate = new Date();
const Rating = require('../../Models/trainerRatingModel');


//---------------------------------------------USER UPDATE THE PROFILE---------------------------
const updateProfile = async (req, res, next) => {
    try {
        const trainerName = req.body.trainer.firstname || req.body.trainer;
        const traienrInfo = await Trainer.findOne({ firstname: trainerName })
        const userInfo = await User.findOne({ _id: req.body._id }).lean()

        if (!req.file) {

            if (!userInfo.profile) {

                return res.status(200).send({ message: 'Profile Image Required', success: false })
            }
            await User.findByIdAndUpdate({ _id: req.body._id }, {
                $set: {
                    lastname: req.body.lastname,
                    phone: req.body.phone,
                    trainer: traienrInfo._id,
                    about: req.body.about,
                    gender: req.body.gender,
                    age: req.body.age,
                    weight: req.body.weight,
                    height: req.body.height,
                }
            })
            return res.status(200).send({ message: 'Update your Profile', success: true })
        } else {
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
            return res.status(200).send({ message: 'Update your Profile', success: true })
        }
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const userData = await User.findOne({ _id: req.body.userId }).populate('trainer');
        const orderDetails = await Order.findOne({ $and: [{ userId: userData._id }, { status: 'Success' }] })
        const endDate = new Date(orderDetails?.proEndIn);
        if (endDate >= todayDate) {
            return res.status(200).send({ message: 'get-user-data', success: true, user: userData, isProUser: true });
        }
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
        const trainerInfo = await Trainer.findOne({ _id: req.body.id });

        const totalRating = await Rating.find({ trainerId: trainerInfo._id })
        const countRating = await Rating.countDocuments({ trainerId: trainerInfo._id });
        const ratingTotal = totalRating.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.rating)
        }, 0)
        const averageRating = Math.floor(ratingTotal / countRating);

        return res.status(200).send({ message: "get-trainer-details success", success: true, trainer: trainerInfo, rating: averageRating, countRating })
    } catch (error) {
       
        next(error)
    }
}
//------------HERER WE CAN RATE THE TRAIENR--------------------------------
const trainerRating = async (req, res, next) => {
    try {
        const { trainerId, rating } = req.body.trainerRating;
        const { userId } = req.body;

        const user = await Rating.findOne({
            $and: [
                { userId: userId },
                { trainerId: trainerId },
            ]
        })
        if (user) {
            await Rating.updateOne({
                $and: [
                    { userId: userId },
                    { trainerId: trainerId }
                ]
            }, {
                $set: {
                    rating: rating
                }
            })
        } else {
            await Rating.create({
                userId: userId,
                trainerId: trainerId,
                rating: rating,
            })
        }

        const trainerRating = await Rating.findOne({
            $and: [
                { trainerId: trainerId },
                { userId, userId }
            ]
        })
        return res.status(201).send({ message: 'submit trainer rating ', success: true, trainerRating })


    } catch (error) {
        console.error(error.message);
        next(error)
    }
}

//--------------------------------  USER PROFILE DETAILS-----------------------------------
const getProfile = async (req, res, next) => {
    try {
        const userData = await User.findOne({ _id: req.body.userId }).populate('trainer')
        if (userData) {
            const trainerRating = await Rating.findOne({
                $and: [
                    { userId: userData._id },
                    { trainerId: userData.trainer._id }
                ]
            })
            const order = await Order.findOne({
                $and: [
                    { userId: req.body.userId },
                    { status: 'Success' }
                ]
            })
            return res.status(200).send({
                message: 'get-user-info', success: true,
                user: userData,
                rating: trainerRating,
                order: order
            });
        }


    } catch (error) {
        next(error)
    }
}


module.exports = {
    updateProfile,
    getUser,
    getProfile,
    getTrainerProfile,
    getTrainer,
    trainerRating,

}