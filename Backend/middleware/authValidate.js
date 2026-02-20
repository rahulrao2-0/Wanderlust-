// backend/middleware/authMiddleware.js
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // get token from cookie
  console.log(token)

  if (!token ) return res.status(401).json({ message: "Not logged in" });
  
  const decoded = verifyToken(token);
  console.log("decoded:-",decoded) // verify token

  if (!decoded) return res.status(401).json({ message: "Invalid or expired token" });

  req.user = decoded; // { id, role }
  next();
};
