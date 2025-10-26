// controllers/rideController.js
import { Ride } from '../models/rideModel.js'; // Import Ride model

export const requestRide = async (req, res) => {
  try {
    const { passenger_id, pickup_lat, pickup_lon, destination_lat, destination_lon } = req.body;

    // Create a new ride using the Ride model
    const ride = await Ride.create({
      passenger_id,
      pickup_lat,
      pickup_lng: pickup_lon, // Map 'pickup_lon' to 'pickup_lng' to match model
      dropoff_lat: destination_lat, // Map 'destination_lat' to 'dropoff_lat'
      dropoff_lng: destination_lon, // Map 'destination_lon' to 'dropoff_lng'
      status: 'pending',
    });

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const { ride_id, rider_id } = req.body;

    // Update the ride using the Ride model
    await Ride.update(
      { rider_id, status: 'accepted' },
      { where: { id: ride_id } }
    );

    res.json({ message: 'Ride accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};