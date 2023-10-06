const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/healthy-life')
.then(()=>console.log('mongodbConnected...'))
.catch((error)=>console.error('error in MongoDB'))

const app= express();
dotenv.config();


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const userRoute = require('./Routes/userRoute');



app.use("/user",userRoute);
            



const port  = process.env.PORT || 5001;
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})    