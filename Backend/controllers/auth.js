import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/jwt.js";
import ExpressError from "../ExpressError.js";
import sendEmail from "../utils/sendEmails.js";
import crypto from "crypto";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ExpressError(409, "User already exists! Please login instead"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const Otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(Otp);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      otp: Otp,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000
    });

    await sendEmail({
      to: email,
      subject: "Verify your email - WanderLust",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Welcome to WanderLust 🌍</h2>
          <p>Use the OTP below to verify your email address:</p>
          <h1 style="letter-spacing: 8px; color: #4F46E5;">${Otp}</h1>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't sign up, ignore this email.</p>
        </div>
      `
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("REAL ERROR:", err);
    next(new ExpressError("Signup Failed", 500));
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.params;
    console.log(otp);

    const user = await User.findOne({
      otp: otp,
      emailVerifyExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    const JWTtoken = createToken(user);

    res.cookie("token", JWTtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (err) {
  console.log("REAL ERROR:", err);
  next(new ExpressError(500, "Signup Failed"));
}
};

export const login = async (req, res, next) => {
  console.log("Login attempt with body:", req.body);
  console.log("login api hit")
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ExpressError(404, "User not found"));
    }

    if (!user.role.includes(role)) {
      return next(new ExpressError(403, "Unauthorized: Role mismatch"));
    }

    if (!user.isVerified) {
      const Otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = Otp;
      user.emailVerifyExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      await sendEmail({
        to: user.email,
        subject: "Verify your email - WanderLust",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
            <h2>Verify your WanderLust account 🌍</h2>
            <p>Use the OTP below to verify your email:</p>
            <h1 style="letter-spacing: 8px; color: #4F46E5;">${Otp}</h1>
            <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          </div>
        `
      });

      return next(new ExpressError(401, "Please verify your email to login"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ExpressError(401, "Incorrect password, try again!"));
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
  console.log("REAL LOGIN ERROR:", err);
  next(new ExpressError(500, "Login Failed"));
}
};

export const logout = (req, res) => {
  console.log("Logout attempt");
  res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};