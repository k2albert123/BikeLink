import express from "express";
import { getNearestBikers } from "../config/googleMaps.js";
import { requestRide } from "../controllers/passengerController.js";
const router = express.Router();

router.get('/', getNearestBikers);
router.post('/ride', requestRide);

export default router;
