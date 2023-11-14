const video = require('../../Models/videoModel');
const user = require('../../Models/userModel');
const moment = require('moment');
const toDayDate = new Date()
const Order = require('../../Models/orderModel');

const getUsersVideos = async (req, res, next) => {
    try {
        const userDetails = await user.findOne({ _id: req.body.userId })
        const getVideos = await video.find({ trainerId: userDetails.trainer });
        const orderDetails = await Order.findOne({ $and: [{ userId: userDetails._id }, { status: "Success" }] });
        const endDate = new Date(orderDetails?.proEndIn)
        if (endDate >= toDayDate) {
            return res.status(200).send({ message: 'fetch-users-video-success', success: true, getVideos, proUser: true })
        } else {
            return res.status(200).send({ message: 'fetch-users-video-success', success: true })
        }
    } catch (error) {
        console.error(error.message);
        next(error)
    }
}

const videoInfoControl = async (req, res, next) => {
    try {
        const videoInfo = await video.findOne({ _id: req.body.videoId })
        return res.status(200).send({ message: 'fetch-users-videoInfo-success', success: true, videoInfo: videoInfo })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getUsersVideos,
    videoInfoControl
}