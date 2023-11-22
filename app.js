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
        origin:'http://localhost:3000',
         methods: ['GET','POST'] 
        
    }
 })  
 io.on('connection',(socket)=>{
    // console.log('connected to socket.io!');
    

    socket.on('setup',(Data)=>{
        socket.join(Data?._id);
        socket.emit('connected..!')
    })    
    socket.on('joinChat',(room)=>{
        socket.join(room);
      
    })
    socket.on('newChat',(newChat)=>{
        socket.emit('messageRecived',newChat)
        socket.emit('messageRecivedTrainer',newChat)
    }) 
        
    socket.on('trainerJoin',(trainerId)=>{ // ----------to connect trainer
        socket.join(trainerId);
        socket.emit('me',trainerId) // ---------id pass

    })

    socket.on('userJoin',(userId)=>{
        socket.join(userId);
        socket.emit('me',userId) // ---------id pass

    })


    socket.on("callUser", ({ userToCall, signalData, from, name }) => { 
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });

	});

	socket.on("answerCall", (data) => { 
		io.to(data.to).emit("callAccepted", data.signal)

	});

    socket.on('disconnect',()=>{   // for video call-----------------
        socket.broadcast.emit('callended')
    });

 }  )      
         
   
   