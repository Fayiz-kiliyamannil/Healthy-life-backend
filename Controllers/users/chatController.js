const chat = require('../../Models/chatModel');
const user = require('../../Models/userModel');


const date = new Date();

const options = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true, // Use 12-hour time format with AM/PM
};

const formattedTime = new Intl.DateTimeFormat('en-IN', options).format(date);


const createNewChat = async (req, res, next) => {//------- CREATE NEW CHAT -BY USERID
    try {
        const { userId, text } = req.body;
        const userInfo = await user.findOne({ _id: userId })

        await chat.create({
            userId: userId,
            trainerId: userInfo.trainer,
            text: text,
            sender: 'trainee',
            time:formattedTime,
        })
        const fetchChatById = await chat.find({ $and: [{ userId: userId }, { trainerId: userInfo.trainer }] }).populate('trainerId')
        return res.status(200).send({ message: 'new chat created', success: true ,fetchChatById });
    } catch (error) {
        next(error)
    }
}

//---------------------FETCH CHAT TO TRAINEE -----------------
const fetchChatById = async (req, res, next) => {  
    try {
        const { userId} = req.body;
        const userInfo = await user.findOne({ _id: userId })
        const fetchChatById = await chat.find({ $and: [{ userId: userId }, { trainerId: userInfo.trainer }] }).populate('trainerId')
        return res.status(200).send({ message: 'fetch chatById', success: true ,fetchChatById});
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createNewChat,
    fetchChatById,
}