const express = require('express');
const adminRoute = express();
const adminController = require('../Controllers/admin/adminController');
const  trainerController = require('../Controllers/admin/adminTrainerController');
const traineeController = require ('../Controllers/admin/adminTraineeController')
const authMiddleware = require ('../Middlewares/authMiddlewares');
const contactController = require('../Controllers/admin/contactController');
const admin = require('../Models/admin');

adminRoute.post('/login',adminController.adminLogin);
adminRoute.get('/get-dashboard-info',authMiddleware,adminController.getAllDetails);
adminRoute.get('/get-sales-info',authMiddleware,adminController.getSalesData);
adminRoute.post('/sales-report',authMiddleware,adminController.getSalesReport)
adminRoute.post('/trainees',authMiddleware,adminController.all_Trainees);
adminRoute.post('/trainers',authMiddleware,trainerController.allTrainerDetails);
adminRoute.get('/newtrainers',authMiddleware,trainerController.newTrainers);
adminRoute.post('/confirm-trainer',authMiddleware,trainerController.confirmTrainer);
adminRoute.post('/delete-trainer',authMiddleware,trainerController.deleteTrainer);
adminRoute.post('/trainee-details',authMiddleware,traineeController .traineeDetails);
adminRoute.post('/trainee-action',authMiddleware,traineeController.userBlockUnblock);
adminRoute.post('/trainer-action',authMiddleware,trainerController.trainerBlockUnblock);
adminRoute.post('/get-trainer-info',authMiddleware,trainerController.trainersDetails)
adminRoute.get('/fetch-inbox',authMiddleware,contactController.getAllMessage);
adminRoute.put('/delete-message/:id',authMiddleware,contactController.forDeleteMessage);

  

module.exports = adminRoute;