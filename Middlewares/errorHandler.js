
module.exports = async(error,req,res,next)=>{
console.error(error.message);
res.status(500).send({ message: error.message, success: false });
}    

