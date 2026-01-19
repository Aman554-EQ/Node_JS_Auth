const multer = require('multer');
const path = require('path');

// Set storage storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // specify the file name
    }
});


// File filter to allow only image files
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

//multer middleware
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // limit file size to 5MB
});