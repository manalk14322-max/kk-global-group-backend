const Newsletter = require("../models/Newsletter");
const asyncHandler = require("../utils/asyncHandler");

const subscribeNewsletter = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    res.status(200).json({
      success: true,
      message: "You're already subscribed to the newsletter",
      data: existing,
    });
    return;
  }

  const subscriber = await Newsletter.create({ email });

  res.status(201).json({
    success: true,
    message: "Newsletter subscription received",
    data: subscriber,
  });
});

module.exports = {
  subscribeNewsletter,
};
