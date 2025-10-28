import express from "express";
import { register, login } from "../controllers/authController.js";
import { authenticate, authorizeAdmin } from "../midelwares/Authentication.js";
import { deleteUser, getUsers } from "../controllers/AdminController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/', getUsers);
router.delete('/:id', deleteUser);

export default router;
