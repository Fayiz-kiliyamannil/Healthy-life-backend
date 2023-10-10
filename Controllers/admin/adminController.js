const adminData = require('../../Models/admin/admin');
const user = require('../../Models/users/userModel')
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken')



const  adminLogin = async(req,res)=>{
    try {
    
     const admin = await adminData.findOne({email:req.body.email})
     console.log(admin);
     if(admin){
        const comparePassword = await bcrypt.compare(req.body.password,admin.password)
        console.log(comparePassword);
        if(comparePassword){
            const token = jwt.sign({ id:admin._id},process.env.JWT_SECRET,{
                expiresIn:'1d'
            });
            
            res.status(200).send({message:'Admin Login Successfull',success:true, admin ,token:{token} })
        }else{
            res.status(200).send({message:'Incorrect password',success:false})
        }

     }else{
        res.status(200).send({message:'The Admin email you entered does not exist',success:false})
     }

    } catch (error) {
        res.send(500).send({message:'error in Admin-login',success:false})
    }
}

const all_Trainees = async (req,res) =>{

  try {
    const userData = await user.find({})
    console.log(userData);
     res.status(200).send({userData,success:true})
  } catch (error) {
    res.status(500).send({message:"error in all_Trainees",succeess:false})
    console.error(error);
  }

}


module.exports = {
    adminLogin,
    all_Trainees,
}