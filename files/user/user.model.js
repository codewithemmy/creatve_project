const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
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
    phone: {
      type: String,
    },
    houseNameColor: {
      type: String,
    },
    referee: {
      type: String,
    },
    refereeAddress: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    password: { type: String },
    accountType: {
      type: String,
      required: true,
      enum: ["teacher"],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const user = mongoose.model("User", userSchema, "user")

module.exports = { User: user }
