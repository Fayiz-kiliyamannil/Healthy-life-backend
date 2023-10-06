const user = require("../../Models/users/userModel")


const userLogin = async (req, res) => {
    try {
        const userData = await user.findOne({ email: req.body.email })
        if (userData) {
                if(userData.password === req.body.password){
                  if(userData.is_block){
                     return res.status(200).send({message:'Your account is blocked',success:false})
                  }else{
                    return res.status(200).send({message:'Login successful',success:true})
                  }
                }else{
                     return res.status(200).send({message:"Incorrect password",success:false})
                }
        } else {
            return res.status(200).send({ message: 'The email you entered does not exist.', success: false })
        }

    } catch (error) {
        console.error("error in login");
    }       

}   

const register = async (req, res) => {
    try {
        const userExist = await user.findOne({ email: req.body.email })
        if (userExist) {
            return res.status(200).send({ message: 'The user already exists', success: false })
        } else {
            const data = await user({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            await data.save()
            return res.status(200).send({ message: 'your account has been successfully created.', success: true })
        }
    } catch (error) {
        console.log("error in register........");
    }
}

module.exports = {
    register,
    userLogin,      
}   