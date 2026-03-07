const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Order = require("./models/Order");
const User = require("./models/User");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://chocofuel.netlify.app", 
    "https://www.chocofuel.com", 
    "https://chocofuel.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"],
  credentials: true,
  exposedHeaders: ["x-auth-token"]
}));
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// POST: Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      phoneNumber,
      password,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    if (!email || !password) {
      console.log("Login failed: Email or password missing");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: No user found with email ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for email ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    console.log(`Login successful for user: ${user.id} (${user.role})`);
    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: Guest registration/login (creates/updates user based on email)
app.post("/api/auth/guest", async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ message: "Name, email, and phone number are required" });
    }

    // Check if user exists by email
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user's info if it's a guest returning
      user.name = name;
      user.phoneNumber = phoneNumber;
      await user.save();
    } else {
      // Create new user (no password for guests)
      user = new User({
        name,
        email,
        phoneNumber,
        role: "user"
      });
      await user.save();
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Guest auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: Create a new order (Protected)
app.post("/api/orders", auth, async (req, res) => {
  try {
    const {
      chocolateType,
      message,
      toppings,
      shippingAddress,
      receiverName,
      receiverNumber,
    } = req.body;

    // Basic validation
    if (!chocolateType || !message || !shippingAddress || !receiverName || !receiverNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      user: req.user.id,
      chocolateType,
      message,
      toppings,
      shippingAddress,
      receiverName,
      receiverNumber,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET: Fetch all orders for the authenticated user (Protected)
app.get("/api/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin Route: Get all users and all orders
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

app.get("/api/admin/data", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password").lean();
    const allOrders = await Order.find().populate("user", "name email").sort({ createdAt: -1 }).lean();
    
    // Group orders by user
    const usersWithOrders = users.map(user => ({
      ...user,
      orders: allOrders.filter(order => order.user && order.user._id.toString() === user._id.toString())
    }));

    res.status(200).json({ users: usersWithOrders, allOrders });
  } catch (error) {
    console.error("Admin data error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/api/admin/orders/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const { isReceived, isShipped } = req.body;
    const update = {};
    if (typeof isReceived === "boolean") update.isReceived = isReceived;
    if (typeof isShipped === "boolean") update.isShipped = isShipped;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chocolate-builder";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
