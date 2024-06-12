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
    psychomotorDomain: {
      drawing: Number,
      painting: Number,
      handWriting: Number,
      sports: Number,
      publicSpeaking: Number,
    },
    affectiveDomain: {
      attentiveness: Number,
      honesty: Number,
      neatness: Number,
      obedience: Number,
      reliability: Number,
      punctuality: Number,
      relations: Number,
      responsibility: Number,
    },
  },
  { timestamps: true }
)

const remarks = mongoose.model("Remarks", remarksSchema, "remarks")

module.exports = { Remarks: remarks }
