const express = require('express');
const trainerRoute = express();
const trainerController = require('../Controllers/trainer/trainerController');
const authMiddleware = require('../Middlewares/authMiddlewares');
const multer = require('../Middlewares/multer');
const videoMulter = require('../Middlewares/videoMulter');
const blogController = require('../Controllers/trainer/blogController')
const videoController = require('../Controllers/trainer/videoController')
const chatController = require('../Controllers/trainer/chatController');


trainerRoute.post('/register', trainerController.trainerRegister);
trainerRoute.post('/login', trainerController.trainerLogin);
trainerRoute.get('/get-dashboard-info',authMiddleware,trainerController.getDashboardInfo);
trainerRoute.get('/get-sales-info',authMiddleware,trainerController.getSalesInfo);
trainerRoute.post('/sales-report',authMiddleware,trainerController.getSalesReport);
trainerRoute.post('/get-trainer-info', authMiddleware, trainerController.trainerProfile);
trainerRoute.post('/trainer-profile-edit', multer.upload.single('profile'), trainerController.trainerEditProfile);
trainerRoute.post('/trainer-upload-blog', multer.upload.single('blogImg'),authMiddleware, blogController.UploadBlog);
trainerRoute.get('/get-trainee-info', authMiddleware, trainerController.getTrainees);
trainerRoute.post('/trainee-details', authMiddleware, trainerController.getTraineeDetails);
trainerRoute.get('/trainer-blog', authMiddleware, blogController.trainerBlog);
trainerRoute.post('/delete-blog', authMiddleware, blogController.deleteBlog);
trainerRoute.post('/edit-blog', authMiddleware, blogController.blogDetails);
trainerRoute.post('/blog-details',authMiddleware,blogController.blogDetails);
trainerRoute.post('/trainer-Edit-blog', multer.upload.single('blogImg'), blogController.editBlog);
trainerRoute.post('/trainee-dietPlan-update', authMiddleware, trainerController.updateDietPlan);
trainerRoute.post('/trainer-upload-video', videoMulter.upload.single('video'),authMiddleware, videoController.uploadVideo);
trainerRoute.get('/fetch-trainer-video',authMiddleware,videoController.getTrainerVideo)
trainerRoute.post('/trainer-video-delete',authMiddleware,videoController.deleteVideo);
trainerRoute.post('/trainer-video-details',authMiddleware,videoController.getVideoDetails);
trainerRoute.post('/trainer-update-video',authMiddleware,videoController.updateVideo);
trainerRoute.post('/trainer-create-chat/:id',authMiddleware,chatController.createNewChat);
trainerRoute.get('/trainer-fetch-chat/:id',authMiddleware,chatController.fetchChats);





module.exports = trainerRoute;       