const Contact = require("../models/Contact");
const asyncHandler = require("../utils/asyncHandler");

const createContact = asyncHandler(async (req, res) => {
  const { name, email, message, serviceType } = req.body;

  const contact = await Contact.create({
    name,
    email: email.toLowerCase(),
    message,
    serviceType,
  });

  res.status(201).json({
    success: true,
    message: "Contact submission received",
    data: contact,
  });
});

module.exports = {
  createContact,
};
