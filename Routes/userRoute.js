 const express = require('express')
 const userRoute =  express();
 const userController = require('../Controllers/users/userController');
 const authMiddlewares   = require('../Middlewares/authMiddlewares');

 

 userRoute.post('/login',userController.userLogin)
 userRoute.post('/register',userController.register);
 userRoute.post('/otp',userController.registerOtp);
 userRoute.post('/get-user-into-by-id',authMiddlewares,userController.userVarified)
  


 module.exports = userRoute;


