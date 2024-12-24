import User from "../models/user/User.mjs";
import UsersDBService from "../models/user/UsersDBService.mjs";
import { prepareToken } from "../../../utils/jwtHelpers.mjs";
import pool from "../../../db/connectDB.mjs";
import bcrypt from "bcryptjs";

class AuthController {
  static async signup(req, res) {
    try {
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
      });
      // user.setPassword(req.body.password);
      const savedUser = await user.save();
      const token = prepareToken(
        {
          id: savedUser._id,
          username: savedUser.username,
        },
        req.headers
      );
      res.status(201).json({
        result: "Signed up successfully",
        token,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({ error: "Signup error" });
    }
  }

  static async login(req, res) {
    if (!req.body.email) {
      return res.status(401).json({ error: "Email is required" });
    }
    if (!req.body.password) {
      return res.status(401).json({ error: "Password is required" });
    }

    try {
      const sql = "SELECT * FROM users WHERE email = ?";
      const [rows] = await pool.query(sql, [req.body.email]);
      const user = rows[0] || null;

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // console.log("Entered password:", req.body.password);
      // console.log("Stored hash:", user.password);

      const result = await bcrypt.compare(req.body.password, user.password);
      console.log(result);

      if (!result) {
        return res.status(401).json({ error: "Login error" });
      }
      const token = prepareToken(
        {
          id: user._id,
          username: user.username,
        },
        req.headers
      );
      res.json({
        result: "Authorized",
        token,
      });
    } catch (err) {
      console.log(err);

      res.status(401).json({ error: "Login error" });
    }
  }
}

export default AuthController;
