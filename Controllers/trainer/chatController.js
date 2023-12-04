const chat = require('../../Models/chatModel')

const date = new Date();

const options = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true, // Use 12-hour time format with AM/PM
};

const formattedTime = new Intl.DateTimeFormat('en-IN', options).format(date);

//------------------------------------TO CREATE NEW CHAT FROM TRAINER TO USER SIDE----------------
const createNewChat = async (req, res, next) => {
    try {
        const userId = req.params.id // user id passing as params
        const trainerId = req.body.userId // trinainer id take from authmiddleware
        await chat.create({
            userId:userId,
            trainerId:trainerId,
            text: req.body.text,
            sender: 'trainer',
            time:formattedTime,
        })
        const fetchChatById = await chat.find({ $and: [{ userId, }, { trainerId }] }).populate('userId')
        return res.status(200).send({ message: 'new chat as been created', success: true,fetchChatById })
    } catch (error) {
        next(error)
    }
}
//--------------------------------TO FETCH CHAT TO SPECIFIC TRAINERS---------------------
const fetchChats = async (req, res, next) => {
    try {
        const userId = req.params.id // user id passing as params
        const trainerId = req.body.userId // trinainer id take from authmiddleware
        const fetchChatById = await chat.find({ $and: [{ userId, }, { trainerId }] }).populate('userId')
        return res.status(200).send({message:'fetch data by Id success',success:true,fetchChatById});
    } catch (error) {
        next(error)      
    }
}   
      

module.exports = {
    createNewChat,
    fetchChats,
}