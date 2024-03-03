const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
    },
    genotype: {
      type: String,
    },
    nationality: {
      type: String,
    },
    state: {
      type: String,
    },
    homeTown: {
      type: String,
    },
    localGovernmentArea: {
      type: String,
    },
    address: {
      type: String,
    },
    parentName: {
      type: String,
    },
    occupation: {
      type: String,
    },
    intendedClass: {
      type: String,
    },
    phone: {
      type: String,
    },
    houseNameColor: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    classId: {
      type: mongoose.Types.ObjectId,
      ref: "SchoolClass",
    },
    password: { type: String },
    accountType: {
      type: String,
      required: true,
      enum: ["student"],
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
