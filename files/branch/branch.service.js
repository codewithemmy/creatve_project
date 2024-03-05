const { default: mongoose } = require("mongoose")
const {
  hashPassword,
  verifyPassword,
  queryConstructor,
  generateOtp,
} = require("../../utils")
const createHash = require("../../utils/createHash")
const { BranchSuccess, BranchFailure } = require("./branch.messages")
const { BranchRepository } = require("../branch/branch.repository")
class BranchService {
  static async createBranch(branchPayload, jwtId) {
    const { body, image } = branchPayload
    const { email, branchName } = body
    const branchExist = await BranchRepository.validateBranch({
      $or: [
        {
          email,
        },
        {
          branchName,
        },
      ],
    })

    if (branchExist) return { success: false, msg: BranchFailure.EXIST }

    const branch = await BranchRepository.create({
      ...body,
      image,
      createdBy: new mongoose.Types.ObjectId(jwtId),
    })

    if (!branch._id) return { success: false, msg: BranchFailure.CREATE }

    return {
      success: true,
      msg: BranchSuccess.CREATE,
    }
  }

  static async updateBranchService(payload, id) {
    const { image, body } = payload
    const { managedBy } = body
    const branch = await BranchRepository.updateBranchDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...body,
        image,
      }
    )

    if (!branch) return { success: false, msg: BranchFailure.UPDATE }

    return {
      success: true,
      msg: BranchSuccess.UPDATE,
    }
  }

  static async getBranchService(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Branch"
    )
    if (error) return { success: false, msg: error }

    const branch = await BranchRepository.findAllBranchParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (branch.length < 1) return { success: false, msg: BranchFailure.FETCH }

    return { success: true, msg: BranchSuccess.FETCH, data: branch }
  }
}

module.exports = { BranchService }
