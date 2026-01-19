const isAdminUser = (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    return res.status(403).json({   
        success: false,
        message: "Access denied(not an Admin). You do not have permission to access this resource."
    });
  }
  next();
};

module.exports = isAdminUser;