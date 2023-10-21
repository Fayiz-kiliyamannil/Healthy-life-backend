const express = require('express');
const adminRoute = express();
const adminController = require('../Controllers/admin/adminController');
const  trainerController = require('../Controllers/admin/adminTrainerController');
const traineeController = require ('../Controllers/admin/adminTraineeController')

adminRoute.post('/login',adminController.adminLogin)
adminRoute.get('/trainees',adminController.all_Trainees);
adminRoute.get('/trainers',trainerController.allTrainerDetails);
adminRoute.post('/trainer-block',trainerController.blockTrainer);
adminRoute.post('/trainer-unblock',trainerController.unBlockTrainer);
adminRoute.get('/newtrainers',trainerController.newTrainers);
adminRoute.post('/confirm-trainer',trainerController.confirmTrainer);
adminRoute.post('/delete-trainer',trainerController.deleteTrainer);
adminRoute.post('/trainee-details',traineeController .traineeDetails);
adminRoute.post('/trainee-action',traineeController.userBlockUnblock);
adminRoute.post('/trainer-action',trainerController.trainerBlockUnblock);
adminRoute.post('/get-trainer-info',trainerController.trainersDetails)


module.exports = adminRoute;