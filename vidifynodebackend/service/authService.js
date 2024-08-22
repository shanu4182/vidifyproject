import db from "../config/db.js";
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { generateToken } from "../middleware/authMiddleware.js";

dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GM,
      pass: process.env.PAS
    }
  });
  
  const sendOTP = (email, otp) => {
    const mailOptions = {
      from: process.env.GM,
      to: email,
      subject: 'Your Vidify Authentication OTP Code',
      text: `Your OTP code is ${otp}`
    };
    return transporter.sendMail(mailOptions);
  };
  
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
  
const registerService = async (req, res) => {
  const { username, email } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length > 0) {
    return res.json({ success: false, message: "Email already registered" });
  }

  const otp = generateOTP();
  await sendOTP(email, otp);

  await db.query("INSERT INTO otps (email, otp) VALUES (?, ?)", [email, otp]);
  res.json({ success: true, message: "OTP sent to email" });
};

const loginService = async (req, res) => {
    console.log(req.body)
  const { email } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length === 0) {
    return res.json({ success: false, message: "Email not registered" });
  }

  const otp = generateOTP();
  await sendOTP(email, otp);

  await db.query("INSERT INTO otps (email, otp) VALUES (?, ?)", [email, otp]);
  res.json({ success: true, message: "OTP sent to email" });
};

const verifyOTPService = async (req, res) => {
    const { email, otp, username } = req.body;
    const [rows] = await db.query(
      "SELECT * FROM otps WHERE email = ? AND otp = ?",
      [email, otp]
    );
  
    if (rows.length === 0) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
  
    await db.query("DELETE FROM otps WHERE email = ?", [email]);
  
    let user;
    if (username) {
      const hashedPassword = await bcrypt.hash("defaultPassword", 10);
      const [result] = await db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
      );
      user = { id: result.insertId, email, username };
    } else {
      const [userRow] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (userRow.length > 0) {
        user = { id: userRow[0].id, email: userRow[0].email, username: userRow[0].username };
      } else {
        return res.json({ success: false, message: "User not found" });
      }
    }
  
    const token = generateToken(user);
    res.json({ success: true, token });
  };
  
export { registerService, loginService, verifyOTPService };
