const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const DEFAULTS = require("../config/defaults");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = String(process.env.ADMIN_EMAIL || DEFAULTS.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD || DEFAULTS.ADMIN_PASSWORD || "").trim();
    const adminName = String(process.env.ADMIN_NAME || DEFAULTS.ADMIN_NAME || "").trim();

    if (!adminName || !adminEmail || !adminPassword) {
      throw new Error("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding admin.");
    }

    const removedAdmins = await User.deleteMany({
      role: "admin",
      email: { $ne: adminEmail },
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      existing.name = adminName;
      existing.password = hashedPassword;
      existing.role = "admin";
      await existing.save();
      console.log(`Admin updated successfully: ${adminEmail}`);
    } else {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`Admin created successfully: ${adminEmail}`);
    }

    if (removedAdmins.deletedCount > 0) {
      console.log(`Removed ${removedAdmins.deletedCount} old admin account(s).`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
