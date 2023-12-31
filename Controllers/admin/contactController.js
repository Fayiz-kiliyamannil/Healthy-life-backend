const Contact = require('../../Models/contact')

const getAllMessage = async (req, res, next) => {
    try {
        const contacts = await Contact.find({}).lean().sort({createdAt:-1})
        return res.status(200).send({ message: 'fetch all message', success: true, contacts });
    } catch (error) {
        next(error)
    }
}

const forDeleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const contacts = await Contact.findByIdAndDelete(id)
        .then(()=> Contact.find().lean().sort({createdAt:-1}))
   
        if (!contacts) {
            return res.send(404).send({ message: 'message not found', success: true })
        }
         
        return res.status(200).send({ message: 'Message Deleted', success: true,contacts })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllMessage,
    forDeleteMessage
}