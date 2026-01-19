const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {

    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error('Error uploading files to Cloudinary:', error);
        throw new Error('upload failed');
    }
}

module.exports = {
    uploadToCloudinary
};