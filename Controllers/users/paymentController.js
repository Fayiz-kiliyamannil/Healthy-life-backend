const Razorpay = require('razorpay');
const Order = require('../../Models/orderModel')
const todayDate = new Date();
const User = require('../../Models/userModel')



var instance = new Razorpay({
    key_id: process.env.KEY_ID, 
    key_secret: process.env.KEY_SECRET,  
})



// ------------------ PLACE SUBSCRIPTION ORDER-------------------
const placePayment = async (req, res) => {  

    const { price, id } = req.body.order;
    const { userId } = req.body;
    const status = 'Processing';
    const trainerFees = Math.floor(price*(70/100))
    const adminFees = Math.ceil(price*(30/100));
     const endDate   =  new Date(todayDate);
     endDate.setDate(endDate.getDate() + 30 * id);
    const randomId = Math.random().toString(16)
    console.log(randomId);
    const option = {
        amount: price,
        currency: "INR",
        receipt: randomId,   
        payment_capture: 1,
        notes: {
            key1: "value3",
            key2: "value2"
        }
    }
    try {
        const findUser = await User.findOne({_id:userId})
          if(!findUser.trainer){
            return  res.status(201).send({ message: 'You are not selected a Trainer', success: false })
          }
        const findOrder = await Order.findOne({ $and: [{ userId: userId }, { status: 'Success' }] })
        if (!findOrder) {
            const response = await instance.orders.create(option);
            await Order.create({
                userId: userId,
                proStartIn: todayDate,   
                proEndIn: endDate,
                noOfMonth:id,
                status: status,
                price: price,
                orderId: response.receipt,
                trainerId:findUser?.trainer,
                trainerFees:trainerFees,
                adminFees:adminFees
            })
            res.send({
                order_id: response.receipt,
                amount: response.amount,
                userId: userId,
                message: 'payment successfully',
                success: true
            })
        } else {
          return  res.status(201).send({ message: 'you have already a plan', success: false })
        }
    } catch (error) {   
        console.error(error.message);
        res.status(404).send({ message: 'Not able to create order.please try again', success: false })
    }
}
// -------------------TO CONFIRM THE PAYMENT ---------------
const confirmPayment = async (req, res) => { 
    const { order_id, userId } = req.body;
    try {
        const data = await Order.findOneAndUpdate({ $and: [{ userId: userId }, { orderId: order_id }] }, {
            $set: {
                status: 'Success'
            }
        }, { new: true }).sort({createdAt:-1})
        return res.status(200).send({ message: 'confirm order Successfull', success: true })
    } catch (error) {
        console.error(error.message);
        res.status(404).send({ message: 'Not able to create order.please try again', success: false })
    }
}

module.exports = {
    placePayment,
    confirmPayment,
}  