const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    branchId: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
    },
    recipient: { type: String },
    title: {
      type: String,
    },
    type: {
      type: String,
      enum: [
        "advert",
        "event",
        "announcement",
        "emailSms",
        "normal",
        "assignment",
      ],
      default: "normal",
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },
  },
  { timestamps: true }
)

const notification = mongoose.model(
  "Notification",
  NotificationSchema,
  "notification"
)

module.exports = { Notification: notification }
