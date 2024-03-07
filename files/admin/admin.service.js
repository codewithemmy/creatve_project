const mongoose = require("mongoose")
const { AdminRepository } = require("./admin.repository")
const {
  hashPassword,
  verifyPassword,
  tokenHandler,
  queryConstructor,
  AlphaNumeric,
} = require("../../utils/index")
const { authMessages } = require("./messages/auth.messages")
const { adminMessages } = require("./messages/admin.messages")
const { UserRepository } = require("../user/user.repository")
const { sendMailNotification } = require("../../utils/email")

class AdminAuthService {
  static async adminSignUpService(body) {
    const { accountType } = body
    const admin = await AdminRepository.fetchAdmin({
      email: body.email,
    })

    if (admin) {
      return { success: false, msg: authMessages.ADMIN_EXISTS }
    }
    let password
    let randomPassword
    if (accountType == "admin") {
      randomPassword = await AlphaNumeric(8)
      password = await hashPassword(randomPassword)
    } else {
      password = await hashPassword(body.password)
    }
    const signUp = await AdminRepository.create({ ...body, password })

    const substitutional_parameters = {
      name: signUp.fullName,
      password: randomPassword,
      email: signUp.email,
    }

    await sendMailNotification(
      signUp.email,
      "CREATIVE SCHOOL ADMIN",
      substitutional_parameters,
      "ADMIN_ACCOUNT"
    )

    return { success: true, msg: authMessages.ADMIN_CREATED, data: signUp }
  }

  static async adminLoginService(body) {
    const admin = await AdminRepository.fetchAdmin({
      email: body.email,
    })

    if (!admin) {
      return {
        success: false,
        msg: authMessages.LOGIN_ERROR,
      }
    }

    const passwordCheck = await verifyPassword(body.password, admin.password)

    if (!passwordCheck) {
      return { success: false, msg: authMessages.LOGIN_ERROR }
    }

    admin.password = undefined

    const token = await tokenHandler({
      _id: admin._id,
      email: admin.email,
      fullName: admin.fullName,
      profileImage: admin.profileImage,
      accountType: admin.accountType,
      isAdmin: true,
    })

    // admin.password = undefined
    return {
      success: true,
      msg: authMessages.ADMIN_FOUND,
      data: { admin, ...token },
    }
  }

  static async getAdminService(userPayload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      userPayload,
      "createdAt",
      "Admin"
    )
    if (error) return { SUCCESS: false, msg: error }

    const getAdmin = await AdminRepository.findAdminParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (getAdmin.length < 1)
      return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    return { success: true, msg: authMessages.ADMIN_FOUND, data: getAdmin }
  }

  static async updateAdminService(data, params) {
    const { image, body } = data
    const admin = await AdminRepository.updateAdminDetails(
      { _id: new mongoose.Types.ObjectId(params) },
      { ...body, image }
    )

    if (!admin) {
      return {
        success: false,
        msg: adminMessages.UPDATE_PROFILE_FAILURE,
      }
    } else {
      return {
        success: true,
        msg: adminMessages.UPDATE_PROFILE_SUCCESS,
      }
    }
  }

  static async changePassword(body) {
    const { prevPassword } = body

    const admin = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(body.id),
    })

    if (!admin) return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    //verify password
    const prevPasswordCheck = await verifyPassword(prevPassword, admin.password)

    if (!prevPasswordCheck)
      return { success: false, msg: authMessages.INCORRECT_PASSWORD }

    //change password
    if (body.password !== body.confirmPassword) {
      return {
        SUCCESS: false,
        msg: "Passwords mismatch",
      }
    }

    let password = await hashPassword(body.password)

    const changePassword = await AdminRepository.updateAdminDetails(
      { _id: new mongoose.Types.ObjectId(body.id) },
      {
        password,
      }
    )

    if (changePassword) {
      return {
        success: true,
        msg: authMessages.PASSWORD_RESET_SUCCESS,
      }
    } else {
      return {
        success: false,
        msg: authMessages.PASSWORD_RESET_FAILURE,
      }
    }
  }

  static async uploadImageService(data, payload) {
    const { image } = data
    const user = await this.updateAdminService({
      params: { id: mongoose.Types.ObjectId(payload._id) },
      body: { image },
    })
    if (!user) {
      return {
        success: false,
        msg: adminMessages.UPDATE_IMAGE_FAILURE,
      }
    } else {
      return {
        success: true,
        msg: adminMessages.UPDATE_IMAGE_SUCCESS,
        user,
      }
    }
  }

  static async getLoggedInAdminService(adminPayload) {
    const { _id } = adminPayload
    const getAdmin = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(_id),
    })

    if (!getAdmin) return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    return { success: true, msg: authMessages.ADMIN_FOUND, data: getAdmin }
  }
}

module.exports = { AdminAuthService }
