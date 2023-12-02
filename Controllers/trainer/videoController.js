const { findByIdAndUpdate } = require('../../Models/userModel');
const Video = require('../../Models/videoModel')
const moment = require('moment');
const date = moment();
const formateData = date.format('DD-MM-YYYY')
const cloudinary = require('../../Middlewares/cloudinaryConfig');



// ------------------HERE TRANER CAN UPLOAD THE VIDEO--------------------
const uploadVideo = async (req, res, next) => {
    try {
        const video = req.file;
        const { userId, header, note } = req.body;
        const videoUpload = await cloudinary.uploader.upload(video.path,{resource_type:'video'})

        await Video.create({
            trainerId: userId,
            header,
            note,
            video: videoUpload.secure_url,
            uploadDate: formateData,
        })
        return res.status(200).send({ message: 'Video Uploaded', success: true })
    } catch (error) {
        next(error)
    }
}

//----------------FETCH - VIDEO TO TRAINER-----------------
const getTrainerVideo = async (req, res, next) => {
    try {
        const { _limit, _page } = req.query;    
        const [totalVideo, trainerVideo] = await Promise.all([
            Video.countDocuments({ trainerId: req.body.userId }),
            Video.find({ trainerId: req.body.userId }).lean().sort({ createdAt: -1 }).limit(_limit).skip(_limit * (_page - 1))
        ])
        const noOfPage = Math.ceil(totalVideo / _limit);
        return res.status(200).send({ message: 'fetch-trainerVideo', success: true, videoData: trainerVideo, noOfPage });
    } catch (error) {
        next(error)
    }
}
//--------------- HERE TRAINER CAN DELETE VIDEO --------------
const deleteVideo = async (req, res, next) => {
    try {
        const { videoId, userId } = req.body;
        if (!videoId || !userId) {
            return res.status(400).send({ message: 'Invalid request. Missing required parameters.', success: false });
        }
        const trainerVideo = await Video.findByIdAndDelete(req.body.videoId)
            .then(() => Video.find({ trainerId: req.body.userId }).lean().sort({ createdAt: -1 }))

        return res.status(200).send({ message: 'Video Deleted', success: true, videoData: trainerVideo });
    } catch (error) {
        next(error);
    }
}

//-----------HERE TRAINER - FETCH VEDIO DETAILS-------------
const getVideoDetails = async (req, res, next) => {
    try {
        const videoDetails = await Video.findOne({ _id: req.body.videoId }).lean()
        return res.status(200).send({ message: 'fetch-videoDetails', success: true, videoDetails });
    } catch (error) {
        next(error)
    }
}

//-------------HERE TRAINER- CAN UPDATE VIDEO-----------------
const updateVideo = async (req, res, next) => {
    try {
        const { videoId, header, note } = req.body
        await Video.findByIdAndUpdate({ _id: videoId }, {
            $set: {
                header,
                note,
            }
        })
        return res.status(200).send({ message: 'Updated Video', success: true, })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    uploadVideo,
    getTrainerVideo,
    deleteVideo,
    getVideoDetails,
    updateVideo

}  