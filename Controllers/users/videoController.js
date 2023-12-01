const video = require('../../Models/videoModel');
const user = require('../../Models/userModel');
const moment = require('moment');
const toDayDate = new Date()
const Order = require('../../Models/orderModel');



const getUsersVideos = async (req, res, next) => {
    try {
         const {_page,_limit} = req.query;
        const {userId} = req.body;   

        const [userDetails,orderDetails] = await Promise.all([
            user.findOne({ _id: userId }),
            Order.findOne({ $and: [{ userId: userId }, { status: "Success" }] })
        ])
        const endDate = new Date(orderDetails?.proEndIn);

        if (endDate >= toDayDate) { 

            const [countVideo,getVideos] = await Promise.all([
                await video.countDocuments({trainerId: userDetails.trainer}),
                await video.find({ trainerId: userDetails.trainer }).sort({createdAt:-1}).limit(_limit).skip(_limit*(_page - 1)),
            ])
            
            const noOfPage = Math.ceil(countVideo/_limit);

            return res.status(200).send({ message: 'fetch-users-video-success', success: true, getVideos, noOfpage:noOfPage,  proUser: true })
        } else {

            return res.status(200).send({ message: 'fetch-users-video-success', success: true })
        }   
    } catch (error) {
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