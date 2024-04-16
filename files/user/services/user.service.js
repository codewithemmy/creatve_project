const mongoose = require("mongoose")
const {
  hashPassword,
  tokenHandler,
  verifyPassword,
  generateOtp,
} = require("../../../utils")
const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")
const { sendMailNotification } = require("../../../utils/email")
const { SchoolClassRepository } = require("../../class/schoolClass.repository")

class UserService {
  static async createUser(payload, params) {
    const { body, image } = payload
    const { name, email, password, intendedClass } = body

    let literalPassword = await hashPassword(password)

    const user = await UserRepository.create({
      ...body,
      profileImage: image,
      password: literalPassword,
      branchId: new mongoose.Types.ObjectId(params?.branchId),
    })

    if (!user._id) return { success: false, msg: UserFailure.CREATE }

    if (intendedClass) {
      await SchoolClassRepository.updateSchoolClassDetails(
        { _id: new mongoose.Types.ObjectId(body.intendedClass) },
        { $push: { teacherId: user._id } }
      )
    }

    try {
      const substitutional_parameters = {
        name: name,
        password: password,
        email: email,
      }

      Promise.all([
        await sendMailNotification(
          email,
          "WELCOME TO CREATIVE SCHOOL",
          substitutional_parameters,
          "CREATIVE_WELCOME"
        ),
        await sendMailNotification(
          params.email,
          "WELCOME TO CREATIVE SCHOOL",
          { email: email, name: body.name, password: password, email: email },
          "STUDENT_CREATED"
        ),
      ])
    } catch (error) {
      console.log("error", error)
    }

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
      _id: userProfile._id,
      name: userProfile.name,
      email: userProfile.email,
      accountType: userProfile.accountType,
      intendedClass: userProfile.intendedClass,
      branchId: userProfile.branchId,
      isAdmin: false,
    })

    const user = {
      _id: userProfile._id,
      name: userProfile.name,
      email: userProfile.email,
      accountType: userProfile.accountType,
      intendedClass: userProfile.intendedClass,
      branchId: userProfile.branchId,
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
