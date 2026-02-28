const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const requireFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => !req.body[field]);
  if (missing.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
  next();
};

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email and password are required");
  }
  if (!isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }
  if (String(password).length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required");
  }
  if (!isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }
  next();
};

const validateContact = (req, res, next) => {
  const { name, email, message, serviceType } = req.body;
  if (!name || !email || !message || !serviceType) {
    res.status(400);
    throw new Error("name, email, message and serviceType are required");
  }
  if (!isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }
  next();
};

const validateInvestorApply = (req, res, next) => {
  const { name, email, phone, country, investmentAmount } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("name, email and phone are required");
  }
  if (!isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }
  if (country && String(country).length > 100) {
    res.status(400);
    throw new Error("country is too long");
  }
  if (investmentAmount !== undefined && Number(investmentAmount) < 0) {
    res.status(400);
    throw new Error("investmentAmount cannot be negative");
  }
  next();
};

module.exports = {
  requireFields,
  validateRegister,
  validateLogin,
  validateContact,
  validateInvestorApply,
};
