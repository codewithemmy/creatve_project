const mongoose = require("mongoose")

const recordSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Types.ObjectId, ref: "SchoolClass" },
    branchId: { type: mongoose.Types.ObjectId, ref: "Branch" },
    studentId: { type: mongoose.Types.ObjectId, ref: "Student" },
    testOne: { type: String },
    testTwo: { type: String },
    testThree: { type: String },
    grade: { type: String },
    total: { type: Number },
    schoolTerm: { type: String, enum: ["first", "second", "third"] },
  },
  { timestamps: true }
)

const record = mongoose.model("Record", recordSchema, "record")

module.exports = { Record: record }
