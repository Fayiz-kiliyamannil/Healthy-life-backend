const express = require('express');
const multer = require('multer');
const path = require ('path');
const app = express();
// Define storage for multer (file uploads)

try {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/profileImage'))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Append the current timestamp to the file name to make it unique
    },   
  });  
     
   const upload = multer({ storage: storage });

   module.exports = {
    storage,
    upload,
}
  
} catch (error) {

  console.error(error,'in multer middleware');
}

  

