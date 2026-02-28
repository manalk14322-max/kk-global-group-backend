const Contact = require("../models/Contact");
const Investor = require("../models/Investor");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});

const getAllInvestors = asyncHandler(async (req, res) => {
  const investors = await Investor.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: investors.length,
    data: investors,
  });
});

const updateInvestorStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req;

  const investor = await Investor.findById(id);
  if (!investor) {
    res.status(404);
    throw new Error("Investor application not found");
  }

  investor.status = status;
  await investor.save();

  res.status(200).json({
    success: true,
    message: `Investor application ${status}`,
    data: investor,
  });
});

const approveInvestor = asyncHandler(async (req, res, next) => {
  req.status = "approved";
  return updateInvestorStatus(req, res, next);
});

const rejectInvestor = asyncHandler(async (req, res, next) => {
  req.status = "rejected";
  return updateInvestorStatus(req, res, next);
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalContacts, totalInvestors, approvedInvestors] = await Promise.all([
    User.countDocuments(),
    Contact.countDocuments(),
    Investor.countDocuments(),
    Investor.countDocuments({ status: "approved" }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalContacts,
      totalInvestors,
      approvedInvestors,
    },
  });
});

module.exports = {
  getAllContacts,
  getAllInvestors,
  approveInvestor,
  rejectInvestor,
  getDashboardStats,
};
