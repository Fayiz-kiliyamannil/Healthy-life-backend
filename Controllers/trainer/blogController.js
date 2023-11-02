const blog = require('../../Models/blogModel');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { findByIdAndUpdate, findOneAndUpdate } = require('../../Models/userModel');

const date = moment();
const formateData = date.format('DD-MM-YYYY')


//---------------------------TRAINER CAN UPLOAD BLOG----------
const UploadBlog = async (req, res) => {
  try {
    await blog.create({ header: req.body.header, note: req.body.note, uploadDate: formateData, trainerId: req.body.userId, blogImg: req.file.filename })
    return res.status(200).send({ message: 'Blog Created', success: true });
  } catch (error) {
    res.status(500).send({ message: 'error in UploadBlog', success: false })
    console.error(error);
  }
}

//-------------TRAINER CAN EDIT BLOG-------------------------------------
const editBlog = async(req,res)=>{
  try {
    const{_id,header,note,blogImg,} = req.body
      await blog.findOneAndUpdate({_id:_id},{$set:{
        header:header,
        note:note,
        blogImg: blogImg ||req.file.filename
      }})
      return res.status(200).send({ message: 'Blog Edited', success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message, success: false })
  }
}


//---------------TRAINER- VIEW-EDIT BLOG--------------------
const trainerBlog = async (req, res) => {
  try {
    const { userId } = req.body
    const trainerBlog = await blog.find({ trainerId: userId }).sort({ createdAt: -1 })
    if (trainerBlog) {
      return res.status(200).send({ message: 'fetch-trainer-blog', success: true, trainerBlog })
    } else {
      return res.status(401).send({ message: 'fetch-trainer-blog not found ', success: false })
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: 'fetch-trainer-blog not found ', success: false })
  }
}

// -------------  TRAIER-CAN DELETE - BLOG----------------
const deleteBlog = async (req, res) => {
  try {
    const { Id, userId } = req.body
    await blog.deleteOne({ _id: Id })
    const trainerBlog = await blog.find({ trainerId: userId }).sort({ createdAt: -1 })
    return res.status(200).send({ message: 'trainer-blog-delete', success: true, trainerBlog: trainerBlog })
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message, success: false })

  }
}

// ------------------------TRAINER CAN EDIT BLOG ----------------
const blogDetails = async (req, res) => {
  try {
    const blogDetails = await blog.findOne({_id:req.body.blogId})
     return res.status(200).send({message:'get blog-details',success:true,blog:blogDetails})
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message, success: false })
  }
}




module.exports = {
  UploadBlog,
  trainerBlog,
  deleteBlog,
  editBlog,
  blogDetails,
}