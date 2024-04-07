const mongoose = require("mongoose")

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    classId: { type: mongoose.Types.ObjectId, ref: "SchoolClass" },
    branchId: { type: mongoose.Types.ObjectId, ref: "Branch" },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const subject = mongoose.model("Subject", subjectSchema, "subject")

module.exports = { Subject: subject }
