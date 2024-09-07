import express from "express";
const router = express.Router();
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authorize } from "../middlewares/authorize.js";

router.post("/login", async (req, res) => {
  try {
    console.log("Login");
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, error: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, error: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, error: "Invalid Credentials" });
    }
    let token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY
    );
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", 
    });
    return res
      .status(200)
      .json({ status: true, message: "User Login Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log("register");
    const { name, email, phoneNumber, password, role } = req.body;
    if (!name || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ status: false, error: "Please fill all the fields" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(400)
        .json({ status: false, error: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      role,
      phoneNumber,
      password: securePassword,
    });
    await user.save();
    return res
      .status(200)
      .json({ status: true, message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

router.get("/logout", authorize(), (req, res) => {
  console.log("logout");
  res.clearCookie("jwtoken", {
    //expire now
    expires: new Date(Date.now()),
    httpOnly: true, // Accessible only by the web server
    secure: process.env.NODE_ENV === "production", // Ensures the cookie is only used over HTTPS
    sameSite: "None", // Required for cross-origin requests
  });
  return res
    .status(200)
    .json({ status: true, message: "User Logout Successfully" });
});

router.get("/me", authorize(), async (req, res) => {
  console.log("me");
  const user = await User.findById(req.user._id);
  return res.status(200).json({
    status: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    },
  });
});

export default router;
