import express from "express";
import { requestRide, acceptRide } from "../controllers/rideController.js";
const router = express.Router();

router.post("/request", requestRide);
router.post("/accept", acceptRide);

export default router;
