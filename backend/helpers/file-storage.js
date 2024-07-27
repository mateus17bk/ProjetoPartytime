const multer = require('multer');
const path = require('path');
const router = require('../routes/userRoutes');

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    }

    
});

module.exports = diskStorage;