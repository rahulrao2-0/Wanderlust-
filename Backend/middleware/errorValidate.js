// middleware/validateBooking.js
export default  (req, res, next) => {
  const { checkIn, checkOut } = req.body;

  if (!checkIn || !checkOut) {
    return res.status(400).json({ error: "Dates are required" });
  }

  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({
      error: "Check-out must be after check-in",
    });
  } 

  next(); // go to controller
};
