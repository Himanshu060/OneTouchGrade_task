import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Unified middleware for authentication and authorization
export const authorize = (requiredRole) => {
  return async (req, res, next) => {
    try {
      console.log("Authenticate middleware");
      const cookieHeader = req.headers.cookie;
      if (!cookieHeader) {
        return res.status(401).json({ status: false, error: "Unauthorized" });
      }
      const tokenCookie = cookieHeader
        .split("; ")
        .find((cookie) => cookie.startsWith("jwtoken="));
      if (!tokenCookie) {
        return res.status(401).json({ status: false, error: "Unauthorized" });
      }
      const token = tokenCookie.split("=")[1];
      if (!token) {
        return res.status(401).json({ status: false, error: "Unauthorized" });
      }
      

      // Decode URI components
      const decodedToken = decodeURIComponent(token);

      const verifiedToken = jwt.verify(decodedToken, process.env.SECRET_KEY);

      const user = await User.findById(verifiedToken._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Attach user info to the request object
      req.user = user;

      // If requiredRole is provided, check if the user's role matches
      if (requiredRole && user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
