// controllers/userController.js
import { User } from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'full_name', 'email', 'phone', 'role', 'created_at'],
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    console.log(userId)
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  try {
    const deleted = await User.destroy({
      where: { id: userId }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } 

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};