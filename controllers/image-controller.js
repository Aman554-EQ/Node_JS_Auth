const Image = require('../models/image');
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImageController = async (req, res) => {
    try {

        //check if file is present
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }
        //upload to cloudinary
        const {url, public_id} = await uploadToCloudinary(req.file.path);
       // store the image url and public_id in mongodb
       const newImage = new Image({
        url,
        public_id,
        uploadedBy: req.userInfo.userId
       });
       await newImage.save();
       return res.status(201).json({
        success: true,
        message: "Image uploaded and saved successfully",
        image: newImage
       });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again later."
        });
    }
}
// const uploadImageController = async (req, res) => {
//   try {
//     //check if file is missing in req object
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "File is required. Please upload an image",
//       });
//     }

//     //upload to cloudinary
//     const { url, publicId } = await uploadToCloudinary(req.file.path);

//     //store the image url and public id along with the uploaded user id in database
//     const newlyUploadedImage = new Image({
//       url,
//       publicId,
//       uploadedBy: req.userInfo.userId,
//     });

//     await newlyUploadedImage.save();

//     //delete the file from local stroage
//     // fs.unlinkSync(req.file.path);

//     res.status(201).json({
//       success: true,
//       message: "Imaged uploaded successfully",
//       image: newlyUploadedImage,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong! Please try again",
//     });
//   }
// };

const fetchImagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const deleteImageController = async (req, res) => {
    try {
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;
        //find the image in the database
        const imageToBeDeleted = await Image.findById(getCurrentIdOfImageToBeDeleted);
        if(!imageToBeDeleted) {
            return res.status(404).json({
                success: false,
                message: "Image not found with the given id"
            });
        }
        //check if the user is authorized to delete the image
        if(imageToBeDeleted.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this image"
            });
        }
        //delete image from cloudinary
        await cloudinary.uploader.destroy(imageToBeDeleted.public_id);
        
        //delete image from mongodb database
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        });
    }
};

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController,
};