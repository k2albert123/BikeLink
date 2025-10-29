// controllers/rideController.js
import { Ride } from '../models/rideModel.js';

export const acceptRide = async (req, res) => {
  try {
    const { ride_id, rider_id } = req.body;

    const rider = await Ride.find({where: {rider_id: rider_id}})

    if(!rider) {
      res.status(401).json({
        "message": "There was no such ride request"
      })
    }

    await Ride.update(
      { rider_id, status: 'busy' },
      { where: { id: ride_id } }
    );

    res.json({ message: 'Ride accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRideRequest = async (req, res) => {
  const { rider_id } = req.params;

  try {
    const requests = await Ride.findAll({
      where: {
        rider_id: rider_id
      }
    })

    res.status(200).json({
      requests
    })
  } catch (error) {
    console.log(error)
    res.status(401).json({
      "message": "Requests were not found"
    })
  }
}
