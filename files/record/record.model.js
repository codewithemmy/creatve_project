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
    schoolTerm: {
      type: String,
      enum: ["first", "second", "third"],
      required: true,
    },
  },
  { timestamps: true }
)
// Middleware to recalculate totalScore before update
recordSchema.pre("findOneAndUpdate", async function () {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery())
    const update = this.getUpdate()

    // Calculate totalScore based on existing and updated values
    const updatedResumptionTest =
      update.resumptionTest !== undefined
        ? update.resumptionTest
        : docToUpdate.resumptionTest
    const updatedMidTermTest =
      update.midTermTest !== undefined
        ? update.midTermTest
        : docToUpdate.midTermTest
    const updatedProject =
      update.project !== undefined ? update.project : docToUpdate.project
    const updatedExamScore =
      update.examScore !== undefined ? update.examScore : docToUpdate.examScore

    const totalScore =
      (updatedResumptionTest || 0) +
      (updatedMidTermTest || 0) +
      (updatedProject || 0) +
      (updatedExamScore || 0)

    // Update the totalScore in the update object
    update.totalScore = totalScore
  } catch (error) {
    console.error("Error in pre findOneAndUpdate middleware:", error)
  }
})

const record = mongoose.model("Record", recordSchema, "record")

module.exports = { Record: record }
