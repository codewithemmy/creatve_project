const mongoose = require("mongoose")

const remarksSchema = new mongoose.Schema(
  {
    comments: { type: String, required: true },
    position: { type: Number, required: true },
    resumptionDate: { type: Date },
    classId: { type: mongoose.Types.ObjectId, ref: "SchoolClass" },
    studentId: { type: mongoose.Types.ObjectId, ref: "Student" },
    schoolTerm: {
      type: String,
      enum: ["first", "second", "third"],
      required: true,
    },
  },
  { timestamps: true }
)

const remarks = mongoose.model("Remarks", remarksSchema, "remarks")

module.exports = { Remarks: remarks }
