import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const router = express.Router();

//  Middleware verifyToken 
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token tidak ada" });

  const token = authHeader.split(" ")[1]; 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token tidak valid" });
  }
};

//  Register 
router.post("/register", async (req, res) => {
  try {
    const { username, password, repassword, email, dateOfBirth, gender, address, city } = req.body;

    if (!username || !password || !repassword || !email || !dateOfBirth || !gender || !address || !city) {
      return res.status(400).json({ message: "Semua harus diisi" });
    }

    if (password !== repassword) {
      return res.status(400).json({ message: "Password dan Repassword tidak sama" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const lastUser = await User.findOne().sort({ userId: -1 });
    let nextNumber = 1;
    if (lastUser && lastUser.userId) {
      const lastNumber = parseInt(lastUser.userId.split("-")[1]);
      nextNumber = lastNumber + 1;
    }
    const userId = "USR-" + String(nextNumber).padStart(3, "0");

    const newUser = await User.create({
      userId,
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      address,
      city,
      role: "customer"
    });

    res.status(201).json({ message: "Registrasi berhasil", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Login 
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Current User 
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
