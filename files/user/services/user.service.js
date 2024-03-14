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
const { SchoolClassRepository } = require("../../class/schoolClass.repository")
// const { sendMailNotification } = require("../../../utils/email")
class UserService {
  static async createUser(payload, params) {
    const { body, image } = payload
    const { name, email, password, classId } = body

    const userExist = await UserRepository.validateUser({
      email,
      name,
    })

    if (userExist) return { success: false, msg: UserFailure.EXIST }

    let literalPassword = await hashPassword(password)

    const user = await UserRepository.create({
      ...body,
      profileImage: image,
      password: literalPassword,
      classId,
      branchId: new mongoose.Types.ObjectId(params?.branchId),
    })

    if (!user._id) return { success: false, msg: UserFailure.CREATE }

    if (classId) {
      await SchoolClassRepository.updateSchoolClassDetails(
        {
          _id: new mongoose.Types.ObjectId(classId),
        },
        {
          $push: { teacher: new mongoose.Types.ObjectId(user._id) },
        }
      )
    }

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
