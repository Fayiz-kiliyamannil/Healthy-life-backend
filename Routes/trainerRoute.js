const express = require('express');
const trainerRoute = express();
const trainerController = require('../Controllers/trainer/trainerController');

trainerRoute.post('/register',trainerController.trainerRegister);
trainerRoute.post('/login',trainerController.trainerLogin);

module.exports = trainerRoute;