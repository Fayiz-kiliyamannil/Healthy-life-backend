
const blog = require('../../Models/blogModel');




// ----------------------HERE THE USER CAN SEE THE ALL BLOG---------------------------------
const getUserBlog = async (req,res,next)=>{
    try {
       const page = req.query._page || 1
       const pageSize = req.query._limit || 6

       const [blogCount,blogData] = await Promise.all([
        await blog.countDocuments(),
        blog.find({}).populate('trainerId').lean().sort({_id:-1}).skip((page - 1) * pageSize).limit(pageSize)
       ])
      
        const numOfPage = Math.ceil(blogCount/pageSize);

        return res.status(200).send({message:'get-user-blog',success:true,blog:blogData,noOfPage:numOfPage})
    } catch (error) {
       next(error)
    }
}


const getBlogDetails = async (req,res,next)=>{
    try {
        const  blogData = await blog.findOne({_id:req.body.blogId}).populate('trainerId') 
        return res.status(200).send({message:'get-blog-details',success:true,blog:blogData})
    } catch (error) {
        next(error)
    }
}

  

module.exports ={
    getUserBlog,
getBlogDetails,
}