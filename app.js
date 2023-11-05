const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const path = require('path')

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB)
    .then(() => console.log('mongodbConnected...'))
    .catch((error) => console.error('error in MongoDB'))

const app = express();




app.use(express.json()); // Parse JSON bodies, if any
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



const userRoute = require('./Routes/userRoute');
const adminRoute = require('./Routes/adminRoute')
const trainerRoute = require('./Routes/trainerRoute');
const errorHandler = require('./Middlewares/errorHandler');

app.use("/user", userRoute);
app.use('/admin', adminRoute); 
app.use('/trainer', trainerRoute);


app.use(errorHandler)
 

const port = process.env.PORT || 5001;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
}) 

 const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{
        origin:'http://localhost:3000'
    }
 })

 io.on('connection',(socket)=>{
    console.log('connected to socket.io.......!');

    socket.on('user-setup',(userData)=>{
        socket.join(userData?._id);
        console.log("userId---------usesr-setup",userData?._id);
        socket.emit('connected..!')
    })

    socket.on('setup',(trainerData)=>{
        socket.join(trainerData?.trainer);
        console.log(trainerData?.trainer,'trainer--Id');
        socket.emit('connected..!')
    })    

    socket.on('joinChat',(room)=>{
        socket.join(room);
        console.log(room,'user join in rooom---');
    })

    socket.on('submitChat',(newChat)=>{
        console.log(newChat,'newchat');
        socket.emit('messageRecived',newChat)
        
    }) 


 })
 

  
  