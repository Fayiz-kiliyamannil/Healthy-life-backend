const { findByIdAndUpdate } = require('../../Models/userModel');
const video = require('../../Models/videoModel')
const moment = require('moment');
const date = moment();
const formateData = date.format('DD-MM-YYYY')

// ------------------HERE TRANER CAN UPLOAD THE VIDEO--------------------
const uploadVideo = async (req, res) => {
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
        res.status(500).send({ message: error.message, success: false })
        console.error(error.message);
    }
}

//----------------FETCH - VIDEO TO TRAINER-----------------
const getTrainerVideo = async(req,res)=>{
    try {
        const trainerVideo = await video.find({trainerId:req.body.userId}).lean().sort({createdAt:-1})
        return res.status(200).send({message:'fetch-trainerVideo',success:true,videoData:trainerVideo});
    } catch (error) {
        res.status(500).send({ message: error.message, success: false })
        console.error(error.message);
    }
}
//--------------- HERE TRAINER CAN DELETE VIDEO --------------
const deleteVideo = async(req,res)=>{
    try {
        await video.findByIdAndDelete(req.body.videoId)
        const trainerVideo = await video.find({trainerId:req.body.userId}).lean()
        return res.status(200).send({message:'Video Deleted',success:true,videoData:trainerVideo});
    } catch (error) {
        res.status(500).send({ message: error.message, success: false })
        console.error(error.message);
    }
}

//-----------HERE TRAINER - FETCH VEDIO DETAILS-------------
const getVideoDetails = async(req,res)=>{
    try {
       const videoDetails = await video.findOne({_id:req.body.videoId}).lean()
       return res.status(200).send({message:'fetch-videoDetails',success:true, videoDetails});
    } catch (error) {
        res.status(500).send({ message: error.message, success: false })
        console.error(error.message);
    }
}

//-------------HERE TRAINER- CAN UPDATE VIDEO-----------------
const updateVideo =async(req,res)=>{
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
        res.status(500).send({ message: error.message, success: false })
        console.error(error.message);
    }
}


module.exports = {
    uploadVideo,
    getTrainerVideo,
    deleteVideo,
    getVideoDetails,
    updateVideo
    
}  