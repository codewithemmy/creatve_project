const mongoose = require("mongoose")

const schoolClassSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
    },
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
)

const schoolClass = mongoose.model(
  "SchoolClass",
  schoolClassSchema,
  "schoolClass"
)

module.exports = { SchoolClass: schoolClass }
