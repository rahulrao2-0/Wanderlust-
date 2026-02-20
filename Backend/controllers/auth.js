import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/jwt.js";
import ExpressError from "../ExpressError.js";
import sendEmail from "../utils/sendEmails.js";
import crypto from "crypto";


export const signup = async (req, res,next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ExpressError(409,"User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    console.log(verifyToken)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified:false,
      emailVerifyToken: verifyToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // const token = createToken(user);
    const verifyURL = `http://localhost:5173/verify-email/${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `
        <h2>Welcome to WanderLust</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyURL}">Verify Email</a>
      `
    });
    

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   sameSite: "strict",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

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
    next(new ExpressError(500,"Signup Failed"))
  }
};
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    console.log(token)

    const user = await User.findOne({
      emailVerifyToken: token ,
      emailVerifyExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link"
      });
    }

    user.isVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;

    await user.save();
    const JWTtoken = createToken(user);

    res.cookie("token", JWTtoken, {
     httpOnly: true,
     sameSite: "lax",
     secure: false,
     maxAge: 24 * 60 * 60 * 1000
     });

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (err) {
    next(err);
  }
};


export const login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user.name)
    if (!user) {
      next(new ExpressError(409,"User not found"))
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ExpressError(401,"Incorrect Password Try Again!"))
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
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
    next(new ExpressError(500,"Login Failed"))
  }
};

export const logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "lax",
    })
    .json({ message: "Logged out successfully" });
};
