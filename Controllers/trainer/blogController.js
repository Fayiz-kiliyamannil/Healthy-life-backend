const blog = require('../../Models/blogModel');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const date = moment();
const formateData = date.format('DD-MM-YYYY')


//---------------------------TRAINER CAN UPLOAD BLOG----------
const UploadBlog = async (req, res) => {
    try {
        console.log(req.body);
        await blog.create({ header: req.body.heading, note: req.body.note, uploadDate:formateData, trainerId:req.body.id, blogImg:req.file.filename})
        return res.status(200).send({ message: 'Blog Created', success: true });
    } catch (error) {
        res.status(500).send({ message: 'error in UploadBlog', success: false })
        console.error(error);
    }
}





module.exports = {
    UploadBlog,
   
}