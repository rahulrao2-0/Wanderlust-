import jwt from "jsonwebtoken";

export const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role ,},  // Payload: user ID + role
    process.env.JWT_SECRET,             // Secret key from .env
    { expiresIn: "1d" }                 // Token expires in 1 day
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // Token invalid or expired
  }
};