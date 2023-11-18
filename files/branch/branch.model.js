const mongoose = require("mongoose")

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
    },
    location: {
      type: String,
    },
    address: {
      type: String,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    description: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "Admin" },
    managedBy: { type: mongoose.Types.ObjectId, ref: "Admin" },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const branch = mongoose.model("Branch", branchSchema, "branch")

module.exports = { Branch: branch }
