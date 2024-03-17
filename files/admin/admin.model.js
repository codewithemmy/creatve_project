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
    phoneNumber: {
      type: String,
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
      enum: ["admin", "superAdmin"],
      default: "admin",
    },
  },
  { timestamps: true }
)

const admin = mongoose.model("Admin", adminSchema, "admin")

module.exports = { Admin: admin }
