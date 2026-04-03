import Notification from "../models/notifications.js";
import Host from "../models/host.js";

export const getLatestNotifications = async (req, res, next) => {
  try {
    console.log("Fetching notifications for user:", req.user.id);

    const host = await Host.findOne({ user: req.user.id });
    const notifications = await Notification.find({ host: host._id })
      .sort({ createdAt: -1 })
      .limit(10);

      console.log("Notifications found:", notifications);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
        console.log("Marking notifications as read for user:", req.user.id);
        const host = await Host.findOne({ user: req.user.id });
    await Notification.updateMany(
      { host: host._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    next(err);
  }
};