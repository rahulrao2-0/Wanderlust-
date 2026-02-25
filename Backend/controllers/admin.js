import Host from "../models/host.js";
import Listing from "../models/listing.js";
import Booking from "../models/booking.js";
import User from "../models/user.js";
import ExpressError from "../ExpressError.js";
const getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const lastMonthBookings = await Booking.find({
    createdAt: { $gte: last30Days }
    }).sort({ createdAt: -1 });
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const latestListings = await Listing.find({
        createdAt: { $gte: last24Hours },
    });
    const latestUsers = await User.find({
        createdAt: { $gte: last24Hours },
    });
     const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const last7Daysbookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          bookings: { $sum: 1 }
        }
      },
      {
      $project: {
        _id: 0,
       day: "$_id",
    bookings: 1
     }
   },
      {
        $sort: { _id: 1 }
      }
    ]);
    console.log(totalUsers,totalListings,totalBookings, latestListings, latestUsers,)
    console.log("Latest Bookings in getAdminStats:", lastMonthBookings)
    console.log("Last 7 Days Bookings in getAdminStats:", last7Daysbookings)
    res.json({
      totalUsers,
      totalListings,
      totalBookings,
      latestListings: latestListings,
      latestBookings: lastMonthBookings,
      latestUsers: latestUsers,
      last7Daysbookings: last7Daysbookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
};

export { getAdminStats };