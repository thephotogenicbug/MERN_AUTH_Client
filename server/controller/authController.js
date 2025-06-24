import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

// @register user
export const register = async (req, res) => {
  // get name, email, password from request body
  const { name, email, password } = req.body;

  // check if user already exisit in the db
  if (!name || !email || !password) {
    return res.json({ success: false, message: "missing details" });
  }

  try {
    // check if user already exisit in the db
    const existingUser = await userModel.findOne({ email });

    // if user exist dont create
    if (existingUser) {
      return res.json({ success: false, message: "user already exist" });
    }

    // hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // if user does not exist create new user and hash the password
    const user = userModel({ name, email, password: hashedPassword });

    //save the new user to db
    await user.save();

    // generate the token using jwt by getting user id from mongoDB exp:7d
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // send cookie in response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d exp time for cookie
    });

    // send welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to MernStack",
      text: `Welcome to mernstack website. Your account has been created with email id: ${email}`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    // if any error while creating user throw an error
    res.json({ success: false, message: error.message });
  }
};

// @ login user
export const login = async (req, res) => {
  // get email, password from request body
  const { email, password } = req.body;

  // validate email password
  if (!email || !password) {
    return res.json({ success: false, message: "email and password required" });
  }

  try {
    // check if user exist from mongoDB
    const user = await userModel.findOne({ email });

    // if user does not exist send invalid email response
    if (!user) {
      res.json({ success: false, message: "invalid email" });
    }

    // compare user entered password and stored password from database using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    // if passwprd does not match send invalid password response
    if (!isMatch) {
      res.json({ success: false, message: "invalid password" });
    }

    // if password match generate token
    // generate the token using jwt by getting user id from mongoDB exp:7d
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // send cookie in response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d exp time for cookie
    });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @logout user
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "logged out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// send verification OTP to the users email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }
    // generate 6 digit random number
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // save otp to database
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // expire in 24hrs

    await user.save();

    // send otp to user email for verification
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };
    // send the email to user
    await transporter.sendMail(mailOption);
    return res.json({
      success: true,
      message: "verification otp sent on email.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// verify users account
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    res.json({ success: false, message: "missing details" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp != otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
    
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
