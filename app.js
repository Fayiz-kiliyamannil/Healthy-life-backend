const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB)
.then(()=>console.log('mongodbConnected...'))
.catch((error)=>console.error('error in MongoDB'))

const app= express();



app.use(express.json()); // Parse JSON bodies, if any
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




const userRoute = require('./Routes/userRoute');



app.use("/user",userRoute);
            



const port  = process.env.PORT || 5001;
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})    