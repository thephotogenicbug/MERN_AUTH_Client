import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

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
