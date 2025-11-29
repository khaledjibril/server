import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../models/userModel.js";
import { sendEmail } from "../utils/mail.js";
import crypto from "crypto";
import {
  saveResetCode,
  verifyResetCode,
  updatePassword,
} from "../models/userModel.js";


export const signup = async (req, res) => {
  try {
    const { fullName, phone, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      fullName,
      phone,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: "Welcome Neriah Photography!",
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome Email</title>

      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }

        .container {
          background-color: #ffffff;
          max-width: 600px;
          margin: 20px auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .header {
          background: linear-gradient(135deg, #111, #444);
          color: white;
          padding: 30px;
          text-align: center;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .content {
          padding: 30px;
          color: #333;
          line-height: 1.7;
        }

        .content h2 {
          color: #222;
          margin-top: 0;
        }

        .btn {
          display: inline-block;
          padding: 12px 25px;
          margin-top: 15px;
          background-color: #000;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        }

        .footer {
          padding: 20px;
          font-size: 13px;
          text-align: center;
          color: #777;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="header">
          <h1>Neriah Photography</h1>
        </div>

        <div class="content">
          <h2>Hello ${user.full_name} 👋</h2>
          <p>
            We’re excited to welcome you to the <strong>Neriah Photography Community</strong>!
          </p>
          <p>
            Thank you for signing up. You're now part of a creative family where beautiful moments are captured and preserved with excellence.
          </p>
          <p>
            Feel free to explore, book sessions, and enjoy premium photography services designed just for you.
          </p>
          
          <a href="www.neriah.vercel.app" class="btn">Visit Your Dashboard</a>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Neriah Photography. All rights reserved.
        </div>
      </div>
    </body>
    </html>
      `,
    });

    // Return user without password
    res.status(201).json({
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, isAdmin: user.is_admin }, // include isAdmin in token payload
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        isAdmin: user.is_admin, // return isAdmin to frontend
      },
      token,
    });
  } catch (err) {
    console.error("SIGNIN ERROR:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);
    if (!user)
      return res.status(404).json({ message: "Email not found" });

    const code = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 1000 * 60 * 10; // 10 minutes

    await saveResetCode(email, code, expires);

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <style>
    body {
      background: #f4f6f8;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #333;
    }

    .container {
      max-width: 480px;
      margin: 40px auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    h1 {
      font-size: 22px;
      margin-bottom: 10px;
      color: #111827;
      text-align: center;
    }

    p {
      font-size: 15px;
      line-height: 1.6;
      text-align: center;
    }

    .code-box {
      margin: 26px auto;
      padding: 16px 26px;
      background: #f0f7ff;
      color: #1d4ed8;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 6px;
      width: fit-content;
      border-radius: 10px;
      border: 1px solid #dbeafe;
    }

    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>Password Reset Request</h1>

    <p>Use the verification code below to reset your password.</p>

    <div class="code-box">${code}</div>

    <p>This code will expire in <strong>10 minutes</strong>.  
    If you didn’t request a password reset, you can safely ignore this email.</p>

    <div class="footer">
      &copy; ${new Date().getFullYear()} The Light Concepts. All rights reserved.
    </div>
  </div>

</body>
</html>`;


    await sendEmail({
      to: email,
      subject: "Password Reset Code",
      html,
    });

    res.json({ message: "Reset code sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await verifyResetCode(email, code);
    if (!user)
      return res.status(400).json({ message: "Invalid code" });

    if (Date.now() > user.reset_code_expires)
      return res.status(400).json({ message: "Code expired" });

    res.json({ message: "Code valid" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);

    await updatePassword(email, hashed);

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
