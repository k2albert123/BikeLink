import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getDistance = async (origin, destination) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  return response.data.rows[0].elements[0].distance.text;
};
