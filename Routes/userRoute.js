 const express = require('express')
 const userRoute =  express();
 const userController = require('../Controllers/users/userController');
 const authMiddlewares   = require('../Middlewares/authMiddlewares');
const profileController  = require('../Controllers/users/profileController');
const blogController = require('../Controllers/users/userBlogConroller')
const multer = require('../Middlewares/multer');
const userVarified  = require('../Middlewares/varifiedUser');
const videoConntroller = require ('../Controllers/users/videoController')
 

 userRoute.post('/login',userController.userLogin)
 userRoute.post('/register',userController.register);
 userRoute.post('/otp',userController.registerOtp);
 userRoute.get('/get-home-info',userController.getHome);
 userRoute.post('/get-user-into-by-id',authMiddlewares,userVarified,userController.userVarified);
 userRoute.get('/get-trainers',authMiddlewares,userController.get_Traienrs);
 userRoute.post('/user-profile-update-info', multer.upload.single('profile'), profileController.updateProfile);
 userRoute.post('/get-user-info',authMiddlewares,profileController.getUser);
 userRoute.get('/get-trainer-info',authMiddlewares,profileController.getTrainer);
 userRoute.post('/get-trainers-details',authMiddlewares,profileController.getTrainerProfile)
 userRoute.post('/profile',authMiddlewares,profileController.getProfile);
 userRoute.get('/get-user-blog-info',authMiddlewares,blogController.getUserBlog);
 userRoute.post('/get-blog-details',authMiddlewares,blogController.getBlogDetails);
 userRoute.post('/contact-info',userController.contactDetails);
 userRoute.get('/get-videos',authMiddlewares,videoConntroller.getUsersVideos);
 userRoute.post('/video-info-control',authMiddlewares,videoConntroller.videoInfoControl)

 
   
 module.exports = userRoute;