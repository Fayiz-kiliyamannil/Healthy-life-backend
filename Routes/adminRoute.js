const express = require('express');
const adminRoute = express();
const adminController = require('../Controllers/admin/adminController')

adminRoute.post('/login',adminController.adminLogin)


module.exports = adminRoute;