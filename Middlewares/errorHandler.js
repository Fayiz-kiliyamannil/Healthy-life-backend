

module.exports = async(error,req,res,next)=>{
return res.status(404).send({message:error.message,success:false})
}