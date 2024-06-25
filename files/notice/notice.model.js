const mongoose = require("mongoose")

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    date: {
      type: Date,
    },
    userType: {
      type: String,
      enum: ["Admin", "User"],
    },
    dueDate: { type: Date },
    createdBy: {
      type: mongoose.Types.ObjectId,
      refPath: "userType",
    },
    time: { type: String },
    noticeType: {
      type: String,
      enum: ["advert", "event", "announcement", "emailSms"],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
)

const notice = mongoose.model("Notice", noticeSchema, "notice")

module.exports = { Notice: notice }
