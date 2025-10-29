import { Ride } from "../models/rideModel.js";

export const requestRide = async (req, res) => {
  try {
    const { passenger_id, rider_id, pickup_lat, pickup_lon, destination_lat, destination_lon } = req.body;

    const rider = await User.find({where: {id: rider_id}});
    if(rider || rider.status === "busy") {
       res.status(404).json("Sorry that rider is unavailable");
    }

    const ride = await Ride.create({
      passenger_id,
      rider_id,
      pickup_lat,
      pickup_lng: pickup_lon, 
      dropoff_lat: destination_lat, 
      dropoff_lng: destination_lon, 
    });

    await User.update(
      {status: "busy"},
      {
        where: {id: rider_id}
      }
    )

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
