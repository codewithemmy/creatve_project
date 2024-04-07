const mongoose = require("mongoose")

const recordSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Types.ObjectId, ref: "SchoolClass" },
    branchId: { type: mongoose.Types.ObjectId, ref: "Branch" },
    studentId: { type: mongoose.Types.ObjectId, ref: "Student" },
    testOne: { type: Number, default: 0 },
    testTwo: { type: Number, default: 0 },
    testThree: { type: Number, default: 0 },
    grade: { type: Number, default: 0 },
    examScore: { type: Number, default: 0 },
    totalScore: {
      type: Number,
      default: function () {
        return (
          (this.testOne || 0) +
          (this.testTwo || 0) +
          (this.testThree || 0) +
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
    update.testOne !== undefined ? update.testOne : this.getQuery().$set.testOne
  const updatedTestTwo =
    update.testTwo !== undefined ? update.testTwo : this.getQuery().$set.testTwo
  const updatedTestThree =
    update.testThree !== undefined
      ? update.testThree
      : this.getQuery().$set.testThree
  const updatedExamScore =
    update.examScore !== undefined
      ? update.examScore
      : this.getQuery().$set.examScore
  update.totalScore =
    (updatedTestOne || 0) +
    (updatedTestTwo || 0) +
    (updatedTestThree || 0) +
    (updatedExamScore || 0)
  next()
})

const record = mongoose.model("Record", recordSchema, "record")

module.exports = { Record: record }
