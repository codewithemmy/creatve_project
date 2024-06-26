const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    reportedUser: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
    reportId: { type: String },
    image: {
      type: String,
    },
    response: {
      title: { type: String },
      message: { type: String },
    },
  },
  { timestamps: true }
)

const report = mongoose.model("Report", reportSchema, "report")

module.exports = { Report: report }


