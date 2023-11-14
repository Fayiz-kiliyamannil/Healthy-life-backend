
const User = require('../../Models/userModel');
const Trainer = require('../../Models/trainerModel');
const Order = require('../../Models/orderModel')
const todayDate = new Date()
//---------------------------------------------USER UPDATE THE PROFILE---------------------------

const updateProfile = async (req, res, next) => {
    try {
        const trainerName = req.body.trainer.firstname || req.body.trainer;
        const traienrInfo = await Trainer.findOne({ firstname:trainerName})
      const userInfo = await User.findOne({_id:req.body._id}).lean()
     
        if(!req.file){
    
             if(!userInfo.profile){
                
                return res.status(200).send({message:'Profile Image Required',success:false})
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
        }else{
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
        const orderDetails = await Order.findOne({$and:[{userId:userData._id},{status:'Success'}]})
         const endDate = new Date(orderDetails?.proEndIn);
        if(endDate >= todayDate ) {
            return res.status(200).send({ message: 'get-user-data', success: true, user: userData, isProUser:true });
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
            const trainerInfo = await Trainer.findOne({_id:req.body.id})
            return res.status(200).send({ message: "get-trainer-details success", success: true, trainer: trainerInfo })
    } catch (error) {
        console.error(error.message);
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
    getProfile,
    getTrainerProfile,
    getTrainer,

}