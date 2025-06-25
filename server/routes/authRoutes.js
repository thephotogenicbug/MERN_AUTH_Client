import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
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
// @ /api/auth/is-auth
authRouter.post("/is-auth", userAuth, isAuthenticated);
// @ /api/auth/send-reset-otp
authRouter.post("/send-reset-otp", sendResetOtp);
// @ /api/auth/reset-password
authRouter.post("/reset-password", resetPassword);

export default authRouter;
