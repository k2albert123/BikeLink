import express from "express";
import { acceptRide } from "../controllers/riderController.js";
const router = express.Router();

router.post("/accept", acceptRide);

export default router;
