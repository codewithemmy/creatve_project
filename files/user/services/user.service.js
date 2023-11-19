const mongoose = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  generateOtp,
} = require("../../../utils")
const createHash = require("../../../utils/createHash")
const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")

const { LIMIT, SKIP, SORT } = require("../../../constants")
const { sendMailNotification } = require("../../../utils/email")
// const { sendMailNotification } = require("../../../utils/email")
class UserService {
  static async createUser(payload, jwtId) {
    const { name, email, password, branchId, classId } = payload

    const userExist = await UserRepository.validateUser({
      email,
    })

    if (userExist) return { success: false, msg: UserFailure.EXIST }

    let literalPassword = await hashPassword(password)

    const user = await UserRepository.create({
      ...payload,
      password: literalPassword,
      createdBy: new mongoose.Types.ObjectId(jwtId),
      branchId: new mongoose.Types.ObjectId(branchId),
      classId: new mongoose.Types.ObjectId(classId),
    })

    if (!user._id) return { success: false, msg: UserFailure.CREATE }

    const substitutional_parameters = {
      name: name,
      password: password,
      email: email,
    }

    await sendMailNotification(
      email,
      "WELCOME TO CREATIVE SCHOOL",
      substitutional_parameters,
      "CREATIVE_WELCOME"
    )

    return {
      success: true,
      msg: UserSuccess.CREATE,
    }
  }

  static async userLogin(payload) {
    const { email, password } = payload

    //return result
    const userProfile = await UserRepository.findSingleUserWithParams({
      email: email,
    })

    if (!userProfile) return { success: false, msg: UserFailure.USER_EXIST }

    const isPassword = await verifyPassword(password, userProfile.password)

    if (!isPassword) return { success: false, msg: UserFailure.PASSWORD }

    let token

    userProfile.password = undefined

    token = await tokenHandler({
      ...userProfile,
      isAdmin: false,
    })

    const user = {
      _id: userProfile._id,
      name: userProfile.name,
      email: userProfile.email,
      accounttype: userProfile.accountType,
      ...token,
    }

    //return result
    return {
      success: true,
      msg: UserSuccess.FETCH,
      data: user,
    }
  }
}
module.exports = { UserService }
