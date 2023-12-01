const blog = require('../../Models/blogModel');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { findByIdAndUpdate, findOneAndUpdate } = require('../../Models/userModel');
const cloudinary = require('../../Middlewares/cloudinaryConfig')
const date = moment();
const formateData = date.format('DD-MM-YYYY')


//---------------------------TRAINER CAN UPLOAD BLOG----------

const UploadBlog = async (req, res, next) => {
  try {
    const Image = req.file;
    const imageUpload = await cloudinary.uploader.upload(Image.path);

    await blog.create({
      header: req.body.header,
      note: req.body.note,
      uploadDate: formateData,
      trainerId: req.body.userId,
      blogImg: imageUpload.secure_url
    })

    return res.status(200).send({ message: 'Blog Created', success: true });
  } catch (error) {
    next(error)
  }
}

//-------------TRAINER CAN EDIT BLOG-------------------------------------
const editBlog = async (req, res, next) => {
  try {
    const Image = req.file
    const imageUpload = await cloudinary.uploader.upload(Image.path)
    const { _id, header, note, blogImg, } = req.body
    await blog.findOneAndUpdate({ _id: _id }, {
      $set: {
        header: header,
        note: note,
        blogImg: blogImg || imageUpload.secure_url
      }
    })
    return res.status(200).send({ message: 'Blog Edited', success: true });
  } catch (error) {
    next(error)
  }
}



//---------------TRAINER- VIEW-EDIT BLOG--------------------
const trainerBlog = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { _limit, _page } = req.query;

    const [totalBlog, trainerBlog] = await Promise.all([
      blog.countDocuments({ trainerId: userId }),
      blog.find({ trainerId: userId }).sort({ createdAt: -1 }).limit(_limit).skip(_limit * (_page - 1))
    ])

    const noOfPage = Math.ceil(totalBlog / _limit);
    if (trainerBlog) {
      return res.status(200).send({ message: 'fetch-trainer-blog', success: true, trainerBlog, noOfPage })
    } else {
      return res.status(401).send({ message: 'fetch-trainer-blog not found ', success: false })
    }
  } catch (error) {
    next(error)
  }
}

// -------------  TRAIER-CAN DELETE - BLOG----------------
const deleteBlog = async (req, res, next) => {
  try {
    const { Id, userId } = req.body
    await blog.deleteOne({ _id: Id })
    const trainerBlog = await blog.find({ trainerId: userId }).sort({ createdAt: -1 })
    return res.status(200).send({ message: 'trainer-blog-delete', success: true, trainerBlog: trainerBlog })
  } catch (error) {
    next(error)
  }
}

// ------------------------TRAINER CAN EDIT BLOG ----------------
const blogDetails = async (req, res, next) => {
  try {
    const blogDetails = await blog.findOne({ _id: req.body.blogId })
    return res.status(200).send({ message: 'get blog-details', success: true, blog: blogDetails })
  } catch (error) {
    next(error)
  }
}




module.exports = {
  UploadBlog,
  trainerBlog,
  deleteBlog,
  editBlog,
  blogDetails,
}