const Razorpay = require('razorpay');
const Order = require('../../Models/orderModel')
const moment = require('moment');
const date = moment();
const { v4: uuidv4 } = require('uuid');
const randomID = uuidv4();
const formatDate = date.format('DD-MM-YYYY')
var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
})


// ------------------ PLACE SUBSCRIPTION ORDER-------------------
const placePayment = async (req, res) => {

    const { price, id } = req.body.order;
    const { userId } = req.body;
    const status = 'Processing'
    const enddate = date.add(28 * id, 'days')
    const endDate = enddate.format('DD-MM-YYYY')
    const option = {
        amount: price,
        currency: "INR",
        receipt: randomID,
        payment_capture: 1,
        notes: {
            key1: "value3",
            key2: "value2"
        }
    }
    try {
        const findOrder = await Order.findOne({ $and: [{ userId: userId }, { status: 'Success' }] })
        if (!findOrder) {
            const response = await instance.orders.create(option);
            await Order.create({
                userId: userId,
                proStartIn: formatDate,
                proEndIn: endDate,
                status: status,
                price: price,
                orderId: response.receipt
            })
            res.send({
                order_id: response.receipt,
                amount: response.amount,
                userId: userId,
                message: 'payment successfully',
                success: true
            })
        } else {
            res.status(201).send({ message: 'you have already a plan', success: false })
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
        }, { new: true })
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