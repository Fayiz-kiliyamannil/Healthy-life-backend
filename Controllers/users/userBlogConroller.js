
const blog = require('../../Models/blogModel');


const getUserBlog = async (req,res)=>{
    try {
        const blogData = await blog.find({ }).populate('trainerId').lean()
    console.log(blogData);
        return res.status(200).send({message:'get-user-blog',success:true,blog:blogData})

    } catch (error) {
        res.status(500).send({message:'error in getUserBlog',success:false,error})
        console.error(error);
    }
}
  

module.exports ={
    getUserBlog,
}