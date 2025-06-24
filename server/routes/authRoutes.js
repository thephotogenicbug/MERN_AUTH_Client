import express from "express";
import {
  login,
  logout,
  register,
  sendVerifyOtp,
  verifyEmail,
} from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

// @ /api/auth/register
authRouter.post("/register", register);
// @ /api/auth/login
authRouter.post("/login", login);
// @ /api/auth/logout
authRouter.post("/logout", logout);
// @ /api/auth/send-verify-otp
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
// @ /api/auth/verify-account
authRouter.post("/verify-account", userAuth, verifyEmail);

export default authRouter;
