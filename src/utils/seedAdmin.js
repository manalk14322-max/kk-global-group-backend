const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@kkglobalgroup.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
    const adminName = process.env.ADMIN_NAME || "KK Global Admin";

    const existing = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existing) {
      console.log(`Admin already exists: ${adminEmail}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin created successfully: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
