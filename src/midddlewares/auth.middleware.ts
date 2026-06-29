import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/token.js";
import { User } from "../models/user.model.js";

async function reqAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No auth header, you are not authorized to enter" });
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({
          message: "no token provided, you are not authorized to enter",
        });
    }

    const payload = await verifyAccessToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, you are not authorized to enter" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res
        .status(401)
        .json({ message: "Invalid token, you are not authorized to enter" });
    }

    const reqAuth = req as any;
    reqAuth.user = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.role,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    };

    next();
  } catch (err:any) {
    console.log(err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default reqAuth;
