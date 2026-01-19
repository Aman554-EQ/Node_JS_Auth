const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//register controller
const registerUser = async (req, res) => {
  try {
    //extract user information from our request body
    const { username, email, password, role } = req.body;

    //check if the user is already exists in our database
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User is already exists either with same username or same email. Please try with a different username or email",
      });
    }

    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save in your database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user! please try again.",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
  }
};



//login controller

const loginUser = async (req, res) => {

    try {
        const { username, password } =  req.body;

        //check if the user exists in our database
        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist with the given username. Please register first.'
            });
        }

        //compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password. Please try again.'
            });
        }

        // create JWT token
        const accessToken = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            accessToken
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred! Please try again.'
        });
    }
};


// change password
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // compare old password
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect. Please try again.'
      });
    }

    // ❌ prevent using the same password again
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be the same as the old password.'
      });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred! Please try again.'
    });
  }
};





module.exports = {
    registerUser,
    loginUser,
    changePassword
};