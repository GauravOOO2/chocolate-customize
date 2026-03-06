const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    const adminEmail = "adminUser001@gmail.com";
    const adminPassword = "9!PWO845gb";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists. Updating password...");
      existingAdmin.password = adminPassword;
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Admin user updated successfully.");
    } else {
      const adminUser = new User({
        name: "Admin User",
        email: adminEmail,
        phoneNumber: "0000000000",
        password: adminPassword,
        role: "admin",
      });

      await adminUser.save();
      console.log("Admin user created successfully.");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
