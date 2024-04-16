const mongoose = require("mongoose")

const recordSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Types.ObjectId, ref: "SchoolClass" },
    branchId: { type: mongoose.Types.ObjectId, ref: "Branch" },
    studentId: { type: mongoose.Types.ObjectId, ref: "Student" },
    subjectId: { type: mongoose.Types.ObjectId, ref: "Subject" },
    resumptionTest: { type: Number, default: 0 },
    midTermTest: { type: Number, default: 0 },
    project: { type: Number, default: 0 },
    grade: { type: Number, default: 0 },
    examScore: { type: Number, default: 0 },
    totalScore: {
      type: Number,
      default: function () {
        return (
          (this.resumptionTest || 0) +
          (this.midTermTest || 0) +
          (this.project || 0) +
          (this.examScore || 0)
        )
      },
    },
    schoolTerm: { type: String, enum: ["first", "second", "third"] },
  },
  { timestamps: true }
)

// Middleware to recalculate totalScore before update
recordSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate()
  // Calculate totalScore based on updated values
  const updatedTestOne =
    update.resumptionTest !== undefined
      ? update.resumptionTest
      : this.getQuery().$set?.resumptionTest
  const updatedTestTwo =
    update.midTermTest !== undefined
      ? update.midTermTest
      : this.getQuery().$set?.midTermTest
  const updatedTestThree =
    update.project !== undefined ? update.project : this.getQuery().$set.project
  const updatedExamScore =
    update.examScore !== undefined
      ? update.examScore
      : this.getQuery().$set?.examScore
  update.totalScore =
    (updatedTestOne || 0) +
    (updatedTestTwo || 0) +
    (updatedTestThree || 0) +
    (updatedExamScore || 0)
  next()
})

const record = mongoose.model("Record", recordSchema, "record")

module.exports = { Record: record }
