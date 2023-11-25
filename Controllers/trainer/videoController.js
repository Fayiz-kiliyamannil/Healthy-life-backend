const { findByIdAndUpdate } = require('../../Models/userModel');
const video = require('../../Models/videoModel')
const moment = require('moment');
const date = moment();
const formateData = date.format('DD-MM-YYYY')

// ------------------HERE TRANER CAN UPLOAD THE VIDEO--------------------
const uploadVideo = async (req, res,next) => {
    try {
        const { userId, header, note } = req.body;
            await video.create({
                trainerId: userId,
                header,
                note,
                video: req.file.filename,
                uploadDate:formateData,
            })
            return res.status(200).send({ message: 'Video Uploaded', success: true })
    } catch (error) {
        next(error)
    }
}
   
//----------------FETCH - VIDEO TO TRAINER-----------------
const getTrainerVideo = async(req,res,next)=>{
    try {
        const {_limit,_page} = req.query
        const totalVideo = await video.countDocuments({trainerId:req.body.userId});
        const noOfPage = Math.ceil(totalVideo/_limit);
        const trainerVideo = await video.find({trainerId:req.body.userId}).lean().sort({createdAt:-1})
        .limit(_limit).skip(_limit * (_page - 1))
        return res.status(200).send({message:'fetch-trainerVideo',success:true,videoData:trainerVideo,noOfPage});
    } catch (error) {
    next(error)
    }
}
//--------------- HERE TRAINER CAN DELETE VIDEO --------------
const deleteVideo = async(req,res,next)=>{
    try {
        await video.findByIdAndDelete(req.body.videoId)
        const trainerVideo = await video.find({trainerId:req.body.userId}).lean()
        return res.status(200).send({message:'Video Deleted',success:true,videoData:trainerVideo});
    } catch (error) {
       next(error)
    }
}

//-----------HERE TRAINER - FETCH VEDIO DETAILS-------------
const getVideoDetails = async(req,res,next)=>{
    try {
       const videoDetails = await video.findOne({_id:req.body.videoId}).lean()
       return res.status(200).send({message:'fetch-videoDetails',success:true, videoDetails});
    } catch (error) {
        next(error)
    }
}

//-------------HERE TRAINER- CAN UPDATE VIDEO-----------------
const updateVideo =async(req,res,next)=>{
    try {
       const {videoId,header,note} = req.body
  await  video.findByIdAndUpdate({ _id:videoId},{
    $set:{
        header,
        note,
    }
  })
  return res.status(200).send({message:'Updated Video',success:true,})
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