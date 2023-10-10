const express = require('express');
const adminRoute = express();
const adminController = require('../Controllers/admin/adminController')

adminRoute.post('/login',adminController.adminLogin)
adminRoute.get('/trainees',adminController.all_Trainees);


module.exports = adminRoute;