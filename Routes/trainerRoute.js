const express = require('express');
const trainerRoute = express();
const trainerController = require('../Controllers/trainer/trainerController');
const authMiddleware = require('../Middlewares/authMiddlewares');
const multer  = require('../Middlewares/multer')


trainerRoute.post('/register',trainerController.trainerRegister);
trainerRoute.post('/login',trainerController.trainerLogin);
trainerRoute.post('/get-trainer-info',authMiddleware,trainerController.trainerProfile);
trainerRoute.post('/trainer-profile-edit',multer.upload.single('profile'),trainerController.trainerEditProfile)


module.exports = trainerRoute; 