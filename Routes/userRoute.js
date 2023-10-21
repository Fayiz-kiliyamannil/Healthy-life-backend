 const express = require('express')
 const userRoute =  express();
 const userController = require('../Controllers/users/userController');
 const authMiddlewares   = require('../Middlewares/authMiddlewares');
const profileController  = require('../Controllers/users/profileController');
const blogController = require('../Controllers/users/userBlogConroller')
const multer = require('../Middlewares/multer')
 

 userRoute.post('/login',userController.userLogin)
 userRoute.post('/register',userController.register);
 userRoute.post('/otp',userController.registerOtp);
 userRoute.post('/get-user-into-by-id',authMiddlewares,userController.userVarified);
 userRoute.get('/get-trainers',userController.get_Traienrs);
 userRoute.post('/user-profile-update-info', multer.upload.single('profile'), profileController.updateProfile);
 userRoute.post('/get-user-info',profileController.getUser);
 userRoute.get('/get-trainer-info',profileController.getTrainer);
 userRoute.post('/get-trainers-details',profileController.getTrainerProfile)
 userRoute.post('/profile',authMiddlewares,profileController.getProfile);
 userRoute.get('/get-user-blog-info',blogController.getUserBlog);
 userRoute.post('/get-blog-details',authMiddlewares,blogController.getBlogDetails);
 userRoute.post('/contact-info',userController.contactDetails);

 
   
 module.exports = userRoute;