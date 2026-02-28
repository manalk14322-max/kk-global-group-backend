const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Unauthorized: token missing");
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500);
    throw new Error("JWT_SECRET is missing in environment variables.");
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Unauthorized: user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Unauthorized: invalid or expired token");
  }
});

module.exports = {
  protect,
};
