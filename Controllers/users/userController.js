const user = require("../../Models/userModel")
const trainers = require('../../Models/trainerModel')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const contact = require('../../Models/contact')


//otp-gmail  
let email;
let otp;
let password;
let name
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: 'aranoz560@gmail.com',
        pass: 'rkgofwozptrhroah',
    }

});

const CallOtp = () => {
    otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    console.log(otp);
}



//password bcrypt---------------------


const securePassword = async (password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
        console.log(passwordHash);
    } catch (error) {
        console.error("securepassworderrorr.........");
    }
}




const userLogin = async (req, res) => {
    try {
        const userData = await user.findOne({ email: req.body.email })
        if (userData) {
            const comparePassword = await bcrypt.compare(req.body.password, userData.password)
            if (comparePassword) {
                if (userData.is_block) {
                    return res.status(200).send({ message: 'Your account is blocked', success: false })
                } else {
                    // CREATE JWT TOKEN --------------------
                    const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
                        expiresIn: "1d",
                    });
                           
                    return res.status(200).send({ message: 'Login successful', success: true, data: token })
                }
            } else {
                return res.status(200).send({ message: "Incorrect password", success: false })
            }
        } else {
            return res.status(200).send({ message: 'The email you entered does not exist.', success: false })
        }

    } catch (error) {
        res.status(500).send({ message: "Error in Login", success: false, error })
        console.error("error in login", error);
    }

}

const register = async (req, res) => {
    try {
        const userExist = await user.findOne({ email: req.body.email })
        if (userExist) {
            return res.status(200).send({ message: 'The user already exists', success: false })
            
        }else if(req.body.password !== req.body.repassword){
         return res.status(200).send({message:'Password do not match.',success:false})
        }
        
        else {
            const passwordhash = await securePassword(req.body.password)
            email = req.body.email || email;
            password = passwordhash || password,
                name = req.body.name || name,
                // send mail with defined transport object
                CallOtp()
            var mailOptions = {
                to: req.body.email || email,
                subject: "Otp for registration is: ",
                html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                return res.status(200).send({ message: 'otp has been sent', success: true })

            });

        }
    } catch (error) {
        console.log("error in register........");
    }
}
//RESEND OTP-----------------------






const registerOtp = async (req, res) => {
    try {
        console.log(req.body.Otp);

        if (req.body.Otp == otp) {
            const data = await user({
                email: email,
                password: password,
                firstname: name
            })
            data.save();

            return res.status(200).send({ message: 'Registration has been successfully completed ', success: true })

        } else {
            return res.status(200).send({ message: "Error! Incorrect OTP Entered", success: false })
        }
    } catch (error) {
        console.log("otperror......");
    }
}


const userVarified = async (req, res) => {
    try {
        const users = await user.findOne({ _id: req.body.userId })

        if (users) { 
            return res.status(200).send({ success: true, data:users})
        } else {
            return res.status(200).send({ message: "user does not exist", success: false })
        }
    } catch (error) {
        return res.status(500).send({ message: "error getting user info", success: false })
    }
}

//---------------------------------get trainer ----------------------------------------
const get_Traienrs = async (req, res) => {
    try {
        const trainersData = await trainers.find({is_block:false,is_verified:true});
        const fourTrainer = await trainers.find({is_block:false,is_verified:true}).limit(4)

        return res.status(200).send({message:"get-trainers-info",success:true,trainers:trainersData ,trainer:fourTrainer})
    } catch (error) {
        res.status(500).send({ message: "error in get_trainers", success: false })
        console.error(error);
    }
}


const contactDetails = async(req,res)=>{
    try {
       console.log(req.body);
       await contact.create({
        name:req.body.name,
        email:req.body.email,
        message:req.body.message
       })
       return res.status(200).send({message:'Your message sent' ,success:true})
    } catch (error) {
        res.status(500).send({ message: "error in contact details", success: false })
        console.error(error);
    }
}


module.exports = {
    register,
    userLogin,
    registerOtp,
    userVarified,
    get_Traienrs,
    contactDetails,

}