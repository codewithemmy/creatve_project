const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    image: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    branchId: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      enum: ["subAdmin", "superAdmin"],
      default: "superAdmin",
    },
  },
  { timestamps: true }
)

const admin = mongoose.model("Admin", adminSchema, "admin")

module.exports = { Admin: admin }
