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
const { LIMIT, SKIP, SORT } = require("../../constants")
const { AdminRepository } = require("../admin/admin.repository")

class BranchService {
  static async createBranch(branchPayload, jwtId) {
    const { email, branchName } = branchPayload
    const branchExist = await BranchRepository.validateBranch({
      email,
      branchName,
    })

    if (branchExist) return { success: false, msg: BranchFailure.EXIST }

    const branch = await BranchRepository.create({
      ...branchPayload,
      createdBy: new mongoose.Types.ObjectId(jwtId),
    })

    if (!branch._id) return { success: false, msg: BranchFailure.CREATE }

    return {
      success: true,
      msg: BranchSuccess.CREATE,
    }
  }

  static async updateBranchService(id, payload, jwtId) {
    const { image, body } = payload
    const { managedBy } = body
    const branch = await BranchRepository.updateBranchDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...body,
        createdBy: new mongoose.Types.ObjectId(jwtId),
        image,
      }
    )

    if (!branch) return { success: false, msg: BranchFailure.UPDATE }

    const admin = await AdminRepository.updateAdminById(managedBy, {
      branchId: new mongoose.Types.ObjectId(branch._id),
    })

    if (!admin)
      return { success: false, msg: `unable to assign branch to admin` }

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
