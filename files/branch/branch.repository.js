const { Branch } = require("./branch.model")
const mongoose = require("mongoose")

class BranchRepository {
  static async create(branchPayload) {
    return Branch.create(branchPayload)
  }

  static async findBranchWithParams(branchPayload, select) {
    return Branch.find({ ...branchPayload }).select(select)
  }

  static async findSingleUserWithParams(branchPayload, select) {
    const branch = Branch.findOne({ ...branchPayload }).select(select)

    return branch
  }

  static async validateBranch(branchPayload) {
    return Branch.exists({ ...branchPayload })
  }

  static async findAllBranchParams(branchPayload) {
    const { limit, skip, sort, ...restOfPayload } = branchPayload

    const branch = Branch.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return branch
  }

  static async updateBranchDetails(id, params) {
    return Branch.findOneAndUpdate(
      { ...id },
      { ...params } //returns details about the update
    )
  }

  static async deleteBranchById(id) {
    return Branch.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) })
  }
}

module.exports = { BranchRepository }
