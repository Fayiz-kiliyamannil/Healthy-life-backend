const video = require('../../Models/videoModel');
const user = require('../../Models/userModel');

const getUsersVideos = async (req, res, next) => {
    try {
        const userDetails = await user.findOne({ _id: req.body.userId })
        const getVideos = await video.find({ trainerId: userDetails.trainer })
        return res.status(200).send({ message: 'fetch-users-video-success', success: true, getVideos })
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