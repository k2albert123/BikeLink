import axios from "axios";
import dotenv from "dotenv";
import { User } from "../models/userModel.js"; // adjust path to your model
dotenv.config();

export const getDistances = async (origin, destinations) => {
  try {
    const destString = destinations
      .map((b) => `${b.latitude},${b.longitude}`)
      .join("|");

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origin
    )}&destinations=${encodeURIComponent(destString)}&key=${
      process.env.GOOGLE_MAPS_API_KEY
    }`;

    const response = await axios.get(url);
    const elements = response.data.rows[0].elements;

    return elements.map((el, i) => ({
      name: destinations[i].name,
      email: destinations[i].email, // optional, remove if you don’t want
      location: {
        lat: destinations[i].latitude,
        lng: destinations[i].longitude,
      },
      distanceText: el.distance?.text || "Unknown",
      distanceValue: el.distance?.value || Infinity, // meters
      durationText: el.duration?.text || "Unknown",
    }));
  } catch (err) {
    console.error("Error fetching distances:", err.message);
    return [];
  }
};

export const getNearestBikers = async (req, res) => {
  try {
    const { origin, maxDistanceKm } = req.body;

    if (!origin) {
      return res.status(400).json({ error: "Please provide 'origin'." });
    }

    const allUsers = await User.findAll({
      where: { role: "biker", status: "available" },
      attributes: ["name", "email", "latitude", "longitude"],
    });

    if (allUsers.length === 0) {
      return res.status(404).json({ error: "No bikers found." });
    }

    const bikers = allUsers.map((u) => u.toJSON());
    const distances = await getDistances(origin, bikers);

    const sorted = distances.sort((a, b) => a.distanceValue - b.distanceValue);

    const nearby = maxDistanceKm
      ? sorted.filter((b) => b.distanceValue <= maxDistanceKm * 1000)
      : sorted;

    res.status(200).json({
      origin,
      count: nearby.length,
      nearestBikers: nearby,
    });
  } catch (err) {
    console.error("Error calculating nearest bikers:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
