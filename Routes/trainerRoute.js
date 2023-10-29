const express = require('express');
const trainerRoute = express();
const trainerController = require('../Controllers/trainer/trainerController');
const authMiddleware = require('../Middlewares/authMiddlewares');
const multer  = require('../Middlewares/multer');
const  blogController = require('../Controllers/trainer/blogController')


trainerRoute.post('/register',trainerController.trainerRegister);
trainerRoute.post('/login',trainerController.trainerLogin);
trainerRoute.post('/get-trainer-info',authMiddleware,trainerController.trainerProfile);
trainerRoute.post('/trainer-profile-edit',multer.upload.single('profile'),trainerController.trainerEditProfile);
trainerRoute.post ('/trainer-upload-blog',multer.upload.single('blogImg'),blogController.UploadBlog)
trainerRoute.post('/get-trainee-info',authMiddleware,trainerController.getTrainees);
trainerRoute.post('/trainee-details',authMiddleware,trainerController.getTraineeDetails);
trainerRoute.post('/trainer-blog',authMiddleware,blogController.trainerBlog);
trainerRoute.post('/delete-blog',authMiddleware,blogController.deleteBlog);
trainerRoute.post('/edit-blog',authMiddleware,blogController.blogDetails);
trainerRoute.post('/trainer-Edit-blog',multer.upload.single('blogImg'),blogController.editBlog)
module.exports = trainerRoute;    