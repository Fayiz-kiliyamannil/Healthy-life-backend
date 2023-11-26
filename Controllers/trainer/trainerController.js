const bcrypt = require("bcrypt");
const trainer = require("../../Models/trainerModel");
const jwt = require("jsonwebtoken");
const trainee = require("../../Models/userModel");
const Blog = require('../../Models/blogModel');
const Video = require('../../Models/videoModel');
const User = require('../../Models/userModel');
const Order = require('../../Models/orderModel');
const Rating = require('../../Models/trainerRatingModel')

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.error("securepassword error");
  }
};




const trainerRegister = async (req, res, next) => {
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
    next(error)
  }
};

const trainerLogin = async (req, res, next) => {
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
    next(error)
  }
};

const trainerProfile = async (req, res, next) => {
  try {
    const trainerData = await trainer.findOne({ _id: req.body.userId });
    const [totalRating, countRating] = await Promise.all([
      Rating.find({ trainerId: trainerData._id }),
      Rating.countDocuments({ trainerId: trainerData._id })
    ])
    const ratingTotal = totalRating.reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.rating)
    }, 0)
    const averageRating = Math.floor(ratingTotal / countRating);


    return res.status(200).send({
      message: "get-Traier-data",
      success: true,
      trainer: trainerData,
      rating: averageRating,
      countRating
    });
  } catch (error) {
    next(error)
  }
};



const trainerEditProfile = async (req, res, next) => {
  try {
    const trainerInfo = await trainer.findOne({ _id: req.body._id })

    if (!req.file) {
      if (!trainerInfo.profile) {

        return res.status(200).send({ message: 'Profile Image Required', success: false })

      } else {
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
    } else {
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
    next(error)
  }
};

//-------------------------  GET TRAINEES------------------
const getTrainees = async (req, res) => {
  try {

    const { _page, _limit } = req.query
    const [totalTrainee, userData] = await Promise.all([
      trainee.countDocuments({ trainer: req.body.userId }),
      trainee.find({ trainer: req.body.userId }).limit(_limit).skip(_limit * (_page - 1)).lean(),
    ])
    const noOfPage = Math.ceil(totalTrainee / _limit)
    return res.status(200).send({
      message: "get trainer data success",
      success: true,
      trainee: userData,
      noOfPage
    });
  } catch (error) {
    res.status(500).send({ message: error, success: false });
    console.error(error);
  }
};

//---------------------------------------GET TRAINEES DETAILS-PROFILE-INFO---------------------------
const getTraineeDetails = async (req, res, next) => {
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
    next(error)
  }
};


//--------------------------TRAINER-CAN-UPDATE TRAINEE DIET PLAN-----------------------
const updateDietPlan = async (req, res, next) => {
  try {
    const { _id, targetWeight, dailyCaloriegoal, proteinIntake, carbohydrateAndTatintake,
      mealPlanCreation, waterIntake, dietaryGoals, nutritionalAnalysis, supplementTracking } = req.body.dietPlan;
    await trainee.findByIdAndUpdate({ _id }, {
      $set: {
        targetWeight,
        dailyCaloriegoal,
        proteinIntake,
        waterIntake,
        carbohydrateAndTatintake,
        mealPlanCreation,
        dietaryGoals,
        nutritionalAnalysis,
        supplementTracking,
      }
    })
    const traineeinfo = await trainee.findOne({ _id: _id }).lean()
    return res.status(200).send({ message: 'New Diet-Plan Updated', success: true, trainee: traineeinfo })
  } catch (error) {
    next(error)
  }
}

//-----------------GET DASHBOARD DETAILS -------------------
const getDashboardInfo = async (req, res, next) => {
  try {
    const startAt = new Date();
    startAt.setHours(0, 0, 0, 0);
    const endAt = new Date()
    endAt.setHours(23, 59, 59, 999);
    const { userId } = req.body;

    const [totalBlog, totalVideo, totalTrainees, salesPerDay, sales, order] = await Promise.all([
      Blog.countDocuments({ trainerId: userId }),
      Video.countDocuments({ trainerId: userId }),
      User.countDocuments({ trainer: userId }),

      Order.find({
        $and: [{
          trainerId: userId
        }, {
          proStartIn: {
            $gte: startAt,
            $lte: endAt
          },
        }, {
          status: "Success"
        },]
      }),

      Order.find({
        $and: [{
          trainerId: userId,
        }, {
          status: 'Success',
        }]
      }),

      Order.find({ trainerId: userId }).populate('userId').sort({ createdAt: -1 }).limit(5)
    ])

    const perDaySales = salesPerDay.reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.price);
    }, 0);
    const perDayProfit = salesPerDay.reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.trainerFees);
    }, 0)
    const totalSales = sales.reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.price)
    }, 0)
    const totalProfit = sales.reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.trainerFees);
    }, 0);


    return res.status(200).send({
      message: 'getDataSuccess', success: true,
      order: order,
      details: {
        totalBlog,
        totalVideo,
        totalTrainees,
        perDaySales,
        perDayProfit,
        totalSales,
        totalProfit,
      }
    })

  } catch (error) {
    next(error)
  }
}

//---------------------getSALES INFORMATION--------------
const getSalesInfo = async (req, res, next) => {
  const { userId } = req.body;
  try {
    let perDate = []
    const totalSalesPerDay = [];
    const totalProfitPerDay = [];

    for (let i = 6; i >= 0; i--) {
      const startAt = new Date()
      startAt.setDate(startAt.getDate() - i)
      startAt.setHours(0, 0, 0, 0)

      const endAt = new Date(startAt);
      endAt.setHours(23, 59, 59, 999);

      const date = startAt.toDateString()
      const dateAndMonth = date.slice(3, 10);
      perDate.push(dateAndMonth);


      const salesPerDay = await Order.find({ // -------to  fetch total  Order previos 7 days
        $and: [{
          proStartIn: {
            $gte: startAt,
            $lte: endAt,
          }
        }, {
          status: 'Success'
        }, {
          trainerId: userId,
        }]
      });

      totalSalesPerDay.push(salesPerDay.reduce((accumulator, currentValue) => {
        return accumulator + parseInt(currentValue.price);
      }, 0))

      totalProfitPerDay.push(salesPerDay.reduce((accumulator, currentValue) => {
        return accumulator + parseInt(currentValue.trainerFees)
      }, 0))

    }
    const totalSalesprevSevenDays = totalSalesPerDay.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    })

    return res.status(200).send({
      message: 'get-salesData success',
      totalProfitPerDay,
      totalSalesPerDay,
      totalSalesprevSevenDays,
      date: perDate,
      success: true
    })
  } catch (error) {
    next(error)
  }
}


const getSalesReport = async (req, res, next) => {
  try {
    const { days, userId } = req.body;

    const today = new Date()
    today.setDate(today.getDate() - days)
    today.setHours(0, 0, 0, 0);

    const endAt = new Date();
    endAt.setHours(23, 59, 59, 999);

    const salesReport = await Order.find({
      $and: [{
        createdAt: {
          $gte: today,
          $lte: endAt,
        }
      }, {
        status: 'Success'
      }, {
        trainerId: userId,
      }]
    }).populate('userId').populate('trainerId').sort({ createdAt: -1 })

    return res.status(200).send({ message: "fetch message data", success: true, salesReport })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  trainerRegister,
  trainerLogin,
  trainerProfile,
  trainerEditProfile,
  getTraineeDetails,
  getTrainees,
  updateDietPlan,
  getDashboardInfo,
  getSalesInfo,
  getSalesReport,
};
