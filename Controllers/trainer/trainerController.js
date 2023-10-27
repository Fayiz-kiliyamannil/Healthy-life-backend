const bcrypt = require("bcrypt");
const trainer = require("../../Models/trainerModel");
const jwt = require("jsonwebtoken");
const trainee = require("../../Models/userModel");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.error("securepassword error");
  }
};

const trainerRegister = async (req, res) => {
  try {
    const trainerExist = await trainer.findOne({ email: req.body.email });
    const username = await trainer.findOne({ name: req.body.name });
    if (trainerExist) {
      res
        .status(200)
        .send({ message: "The Trainer already exists", success: false });
    } else if (username) {
      res
        .status(200)
        .send({ message: "The Trainer Name already exists", success: false });
    } else {
      const passwordhash = await securePassword(req.body.password);
      // console.log(passwordhash);
      const data = new trainer({
        email: req.body.email,
        password: passwordhash,
        firstname: req.body.name,
        phone: req.body.phone,
      });
      await data.save();
      res
        .status(200)
        .send({ message: "Trainer registration is successful", success: true });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error in trainerRegister", success: false });
  }
};

const trainerLogin = async (req, res) => {
  try {
    const trainerData = await trainer.findOne({ email: req.body.email });
    if (trainerData) {
      const is_Match = await bcrypt.compare(
        req.body.password,
        trainerData.password
      );
      if (is_Match) {
        if (trainerData.is_block) {
          return res
            .status(200)
            .send({ message: "Account is blocked", success: false });
        } else {
          if (trainerData.is_verified) {
            const trainerToken = jwt.sign(
              { id: trainerData._id },
              process.env.JWT_SECRET,
              {
                expiresIn: "1d",
              }
            );
            return res.status(200).send({
              message: "Login successfull",
              success: true,
              data: trainerToken,
            });
          } else {
            return res
              .status(200)
              .send({ message: "Not varified account", success: false });
          }
        }
      } else {
        return res
          .status(200)
          .send({ message: "Incorrect password", success: false });
      }
    } else {
      return res
        .status(200)
        .send({ message: " Trainer not exist ", success: false });
    }
  } catch (error) {
    res.status(500).send({ message: "error in trainer login", success: false });
    console.error(error);
  }
};

const trainerProfile = async (req, res) => {
  try {
    const trainerData = await trainer.findOne({ _id: req.body.userId });
    return res.status(200).send({
      message: "get-Traier-data",
      success: true,
      trainer: trainerData,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error in trainerProfile", success: false });
    console.error(error);
  }
};

const trainerEditProfile = async (req, res) => {
  try {
  
const trainerInfo = await trainer.findOne({_id:req.body._id})

 if(!req.file){
  if(!trainerInfo.profile){
  
    return res.status(200).send({message:'Profile Image Required',success:false})
    
  }else{
      await trainer.findByIdAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phone: req.body.phone,
          about: req.body.about,
          gender: req.body.gender,
          specilized: req.body.specilized,
          age: req.body.age,
          weight: req.body.weight,
          height: req.body.height,
        },
      }
    )
  }
  }else{
    await trainer.findByIdAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          profile: req.file.filename,
          phone: req.body.phone,
          about: req.body.about,
          gender: req.body.gender,
          specilized: req.body.specilized,
          age: req.body.age,
          weight: req.body.weight,
          height: req.body.height,
        },
      }
    );
  }
    return res
      .status(200)
      .send({ message: "Trainer Profile updated", success: true });
  } catch (error) {
    res.status(500).send({ message: error, success: false });
    console.error(error.message);
  }
};

//-------------------------  GET TRAINEES------------------
const getTrainees = async (req, res) => {
  try {
    const userData = await trainee.find({ trainer: req.body.userId }).lean();
    return res.status(200).send({
      message: "get trainer data success",
      success: true,
      trainee: userData,
    });
  } catch (error) {
    res.status(500).send({ message: error, success: false });
    console.error(error);
  }
};

//---------------------------------------GET TRAINEES DETAILS-PROFILE-INFO---------------------------

const getTraineeDetails = async (req, res) => {
  try {
    const userDetails = await trainee.findOne({ _id: req.body.traineeId }).populate('trainer');
    return res
      .status(200)
      .send({
        message: "get trainer details success",
        success: true,
        trainee: userDetails,
      });
  } catch (error) {
    res.status(500).send({ message: error, success: false });
    console.error(error);
  }
};



module.exports = {
  trainerRegister,
  trainerLogin,
  trainerProfile,
  trainerEditProfile,
  getTraineeDetails,
  getTrainees
};
