const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    parentName: {
      type: String,
    },
    city: {
      type: String,
    },
    contact: {
      type: String,
    },
    classId: {
      type: mongoose.Types.ObjectId,
      ref: "Class",
    },
    accountType: {
      type: String,
      default: "student",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const student = mongoose.model("Student", studentSchema, "student")

module.exports = { Student: student }
