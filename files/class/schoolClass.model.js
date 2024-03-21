const mongoose = require("mongoose")

const schoolClassSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    tag: {
      type: String,
    },
    level: {
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

//tag
