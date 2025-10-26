// controllers/authController.js
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js'; // Import User model
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Create a new user using the User model
    const user = await User.create({
      full_name: name, // Map 'name' to 'full_name' to match your User model
      email,
      phone,
      password: hashed,
      role: role || 'passenger', // Default to 'passenger' if role is not provided
    });

    

    // Generate JWT token
    res.json({ token: generateToken(user), message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};