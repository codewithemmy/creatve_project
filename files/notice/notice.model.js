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
