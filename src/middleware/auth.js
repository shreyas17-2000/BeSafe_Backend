const jwt = require("jsonwebtoken");

const User = require("../models/user");
exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId);
      if (!user) {
        return res.json({ success: false, message: "unauthorized access" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        res.json({ success: false, message: "unauthorized access" });
      }
      if (error.name === "TokenExpiredError") {
        res.json({ success: false, message: "session exp ired try sign in" });
      }
      res.json({ success: false, message: "Internal server error!" });
    }
  } else {
    res.json({ success: false, message: "unauthorized access" });
  }
};
