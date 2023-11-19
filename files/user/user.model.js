const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    password: { type: String },
    branchId: { type: mongoose.Types.ObjectId, ref: "Branch" },
    classId: { type: mongoose.Types.ObjectId, ref: "class" },
    accountType: {
      type: String,
      required: true,
      enum: ["teacher", "parent"],
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
