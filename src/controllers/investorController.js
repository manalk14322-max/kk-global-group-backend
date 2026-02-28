const Investor = require("../models/Investor");
const asyncHandler = require("../utils/asyncHandler");

const applyInvestor = asyncHandler(async (req, res) => {
  const { name, email, phone, country, investmentAmount } = req.body;

  const investor = await Investor.create({
    user: req.user._id,
    name,
    email: email.toLowerCase(),
    phone,
    country: country || "",
    investmentAmount: investmentAmount || 0,
  });

  res.status(201).json({
    success: true,
    message: "Investor application submitted",
    data: investor,
  });
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Investor.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: applications,
  });
});

module.exports = {
  applyInvestor,
  getMyApplications,
};
