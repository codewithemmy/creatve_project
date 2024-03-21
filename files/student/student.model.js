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
    maritalStatus: {
      type: String,
    },
    city: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    genotype: {
      type: String,
    },
    intendedClass: {
      type: mongoose.Types.ObjectId,
      ref: "SchoolClass",
      required: true,
    },
    gender: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    parentOccupation: {
      type: String,
    },
    nationality: {
      type: String,
    },
    referee: {
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
    refereeAddress: {
      type: String,
    },
    parentName: {
      type: String,
    },
    occupation: {
      type: String,
    },
    phone: {
      type: String,
    },
    subject: {
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
    branchId: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
    },
    password: { type: String },
    accountType: {
      type: String,
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
