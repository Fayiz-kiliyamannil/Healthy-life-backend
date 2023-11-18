const adminData = require('../../Models/admin');
const user = require('../../Models/userModel');
const Trainer = require('../../Models/trainerModel');
const Order = require('../../Models/orderModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const date = new Date();

// const month = todayDate.getMonth()+1
// console.log(month);


const adminLogin = async (req, res) => {
    try {

        const admin = await adminData.findOne({ email: req.body.email })
        console.log(admin);
        if (admin) {
            const comparePassword = await bcrypt.compare(req.body.password, admin.password)
            console.log(comparePassword);
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
        res.send(500).send({ message: 'error in Admin-login', success: false })
    }
}



//------------FETCH DASHBOARD INFO ---------
const getAllDetails = async (req, res) => {
    try {
        const startAt = new Date();
        startAt.setHours(0, 0, 0, 0);
        const endAt = new Date()
        endAt.setHours(23, 59, 59, 999);

        const noOfUsers = await user.countDocuments({ is_block: false });
        const blockedUsers = await user.countDocuments({ is_block: true })
        const noOfTrainers = await Trainer.countDocuments({ is_verified: true });
        const blockedTrainers = await Trainer.countDocuments({is_block:true})
        const  sales =  await Order.find({status:'Success'})
        const salesPerDay = await Order.find({
            $and: [{
                proStartIn: {
                    $gte: startAt,
                    $lte: endAt
                }
            }, {
                status: "Success"
            }]
        })
        const perDaySales = salesPerDay.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.price);
        }, 0);
        const perDayProfit = salesPerDay.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.adminFees);
        }, 0)
        const totalSales = sales.reduce((accumulator,currentValue)=>{
         return accumulator  + parseInt(currentValue.price)
        },0)
        const  totalProfit = sales.reduce((accumulator,currentValue)=>{
            return accumulator + parseInt(currentValue.adminFees)
        },0)
        
        const order = await Order.find().sort({createdAt: -1}).limit(10).populate('userId');
        // const salesReport = await Order.find({status:'Success'}).sort({createdAt:-1}).populate('userId')
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
        console.error(error.message);
    }
}

//----------GET SALES DATA-----------
const getSalesData = async (req, res) => {
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
         const  totalSalesprevSevenDays = totalSalesPerDay.reduce((accumulator,currentValue)=>{
            return accumulator+currentValue;
         })

        return res.status(200).send({
            message: 'get-salesData success',
            totalProfitPerDay,
            totalSalesPerDay,
            totalSalesprevSevenDays,
            date:perDate,
            success: true
        })
    } catch (error) {
        res.status(500).send({ message: "error in get sales data", succeess: false })
        console.error(error.message);
    }
}

 
//----------GET TO  ALL TRAINEES DETAILS --------------
const all_Trainees = async (req, res) => {

    try {
        const userData = await user.find({})
        console.log(userData);
        res.status(200).send({ userData, success: true })
    } catch (error) {
        res.status(500).send({ message: "error in all_Trainees", succeess: false })
        console.error(error);
    }

}


module.exports = {
    adminLogin,
    all_Trainees,
    getAllDetails,
    getSalesData,
}