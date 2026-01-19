const express  = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {uploadImageController, fetchImagesController, deleteImageController} = require("../controllers/image-controller");
const router = express.Router();




// upload the image 
router.post(
    '/upload', 
    authMiddleware, 
    adminMiiddleware, 
    uploadMiddleware.single('image'), 
    uploadImageController
);

// to get all the images
router.get(
    '/get-images', 
    authMiddleware, 
    fetchImagesController
);

// to delete an image
router.delete(
    '/:id',
    authMiddleware,
    adminMiiddleware,
    deleteImageController
);

module.exports = router;