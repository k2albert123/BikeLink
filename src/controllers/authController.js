import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js'; // Import User model
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { name, full_name, email, password, phone, role } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        "message": "Invalid email format"
      });
    }

    const userExist = await User.findOne({ where: { email } });

    if (userExist) {
      return res.status(400).json({
        "message": "User already exists"
      });
    }


    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name: full_name || name,
      email,
      phone,
      password: hashed,
      role: role || 'passenger',
    });

    // Exclude password from response
    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;
    res.json({ token: generateToken(user), user: userWithoutPassword, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Exclude password from response
    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;
    res.json({ token: generateToken(user), user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    await User.update(
      { latitude, longitude },
      { where: { id: userId } }
    );

    res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const logout = async (req, res) => {

}