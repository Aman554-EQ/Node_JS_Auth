const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiiddleware = require("../middleware/admin-middleware");

const router = express.Router();

router.get("/welcome", authMiddleware, adminMiiddleware, (req, res) => {

    res.json({
    message: "Welcome to the Admin page",
  });
});

module.exports = router;