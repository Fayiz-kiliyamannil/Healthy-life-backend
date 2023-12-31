const adminData = require('../../Models/admin');
const user = require('../../Models/userModel');
const Trainer = require('../../Models/trainerModel');
const Order = require('../../Models/orderModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('express');
const date = new Date();



const adminLogin = async (req, res, next) => {
    try {
        const admin = await adminData.findOne({ email: req.body.email })
        if (admin) {
            const comparePassword = await bcrypt.compare(req.body.password, admin.password)
            if (comparePassword) {
                const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                });

                res.status(200).send({ message: 'Admin Login Successfull', success: true, admin, token: { token } })
            } else {
                res.status(200).send({ message: 'Incorrect password', success: false })
            }

        } else {
            res.status(200).send({ message: 'The Admin email you entered does not exist', success: false })
        }

    } catch (error) {
        next(error)
    }
}



//------------FETCH DASHBOARD INFO ---------
const getAllDetails = async (req, res, next) => {
    try {
        const startAt = new Date();
        startAt.setHours(0, 0, 0, 0);
        const endAt = new Date()
        endAt.setHours(23, 59, 59, 999);

        const [noOfUsers, blockedUsers, noOfTrainers, blockedTrainers, sales, salesPerDay, order] = await Promise.all([
            user.countDocuments({ is_block: false }),
            user.countDocuments({ is_block: true }),
            Trainer.countDocuments({ is_verified: true }),
            Trainer.countDocuments({ is_block: true }),
            Order.find({ status: 'Success' }),
            Order.find({
                $and: [{
                    proStartIn: {
                        $gte: startAt,
                        $lte: endAt,
                    }
                }, {
                    status: "Success"
                }]
            }),
            Order.find().sort({ createdAt: -1 }).limit(5).populate('userId'),

        ])

        const perDaySales = salesPerDay.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.price);
        }, 0);
        const perDayProfit = salesPerDay.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.adminFees);
        }, 0)
        const totalSales = sales.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.price)
        }, 0)
        const totalProfit = sales.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.adminFees)
        }, 0)

        return res.status(200).send({
            message: 'getDataSuccess', success: true,
            order: order,

            details: {
                noOfUsers,
                blockedUsers,
                noOfTrainers,
                perDaySales,
                perDayProfit,
                blockedTrainers,
                totalProfit,
                totalSales,
            }
        })
    } catch (error) {
        next(error)
    }
}

//----------GET SALES DATA-----------     
const getSalesData = async (req, res, next) => {
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
                }]
            });

            totalSalesPerDay.push(salesPerDay.reduce((accumulator, currentValue) => {
                return accumulator + parseInt(currentValue.price);
            }, 0))

            totalProfitPerDay.push(salesPerDay.reduce((accumulator, currentValue) => {
                return accumulator + parseInt(currentValue.adminFees)
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

//---------GET SALES REPORT ---------------
const getSalesReport = async (req, res,next) => {
    try {
        const { days } = req.body;

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
            }]
        }).populate('userId').populate('trainerId').sort({ createdAt: -1 })

        return res.status(200).send({ message: "fetch message data", success: true, salesReport })
    } catch (error) {
       next(error)
    }
}


//----------GET TO  ALL TRAINEES DETAILS --------------
const all_Trainees = async (req, res,next) => {
    try {
        const { searchValue } = req.body
        const { _limit, _page } = req.query;
        let query
        if (searchValue) {
             query = {
                $or: [
                    { firstname: { $regex: searchValue, $options: 'i' } },
                    { lastname: { $regex: searchValue, $options: 'i' } },
                ]
            }
        }
        const [totalTrainee, userData] = await Promise.all([
            await user.countDocuments(),
            user.find(query).limit(_limit).skip(_limit * (_page - 1)),
        ])

        const noOfPage = Math.ceil(totalTrainee / _limit);
        res.status(200).send({value:userData, success: true, noOfPage });
    } catch (error) {
        next(error)
    }

}




module.exports = {
    adminLogin,
    all_Trainees,
    getAllDetails,
    getSalesData,
    getSalesReport
}