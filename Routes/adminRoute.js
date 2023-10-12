const express = require('express');
const adminRoute = express();
const adminController = require('../Controllers/admin/adminController');
const  trainerController = require('../Controllers/admin/adminTrainerController')

adminRoute.post('/login',adminController.adminLogin)
adminRoute.get('/trainees',adminController.all_Trainees);
adminRoute.get('/trainers',trainerController.allTrainerDetails);
adminRoute.post('/trainer-block',trainerController.blockTrainer);
adminRoute.post('/trainer-unblock',trainerController.unBlockTrainer);
adminRoute.get('/newtrainers',trainerController.newTrainers);
adminRoute.post('/confirm-trainer',trainerController.confirmTrainer);
adminRoute.post('/delete-trainer',trainerController.deleteTrainer)


module.exports = adminRoute;