const { default: mongoose } = require("mongoose")
const {
  hashPassword,
  queryConstructor,
  verifyPassword,
  tokenHandler,
} = require("../../utils")
const { StudentSuccess, StudentFailure } = require("./student.messages")
const { StudentRepository } = require("./student.repository")
const { sendMailNotification } = require("../../utils/email")
const { SchoolClassRepository } = require("../class/schoolClass.repository")

class StudentService {
  static async createStudent(payload, params) {
    const { body, image } = payload
    const { name, email, password, intendedClass } = body
    if (!intendedClass)
      return {
        success: false,
        msg: `Cannot create student without intended class`,
      }

    let literalPassword = await hashPassword(password)

    const student = await StudentRepository.create({
      ...body,
      profileImage: image,
      branchId: new mongoose.Types.ObjectId(params?.branchId),
      password: literalPassword,
    })

    if (!student._id) return { success: false, msg: StudentFailure.CREATE }

    if (student) {
      await SchoolClassRepository.updateSchoolClassDetails(
        { _id: new mongoose.Types.ObjectId(body.intendedClass) },
        { $push: { studentId: student._id } }
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
      msg: StudentSuccess.CREATE,
    }
  }

  static async studentLogin(payload) {
    const { email, password } = payload

    const studentProfile = await StudentRepository.findSingleStudentWithParams({
      email: email,
    })

    if (!studentProfile)
      return { success: false, msg: StudentFailure.NOT_FOUND }

    const isPassword = await verifyPassword(password, studentProfile.password)

    if (!isPassword) return { success: false, msg: `invalid password` }

    let token

    studentProfile.password = undefined

    token = await tokenHandler({
      _id: studentProfile._id,
      name: studentProfile.name,
      email: studentProfile.email,
      accountType: studentProfile.accountType,
      intendedClass: studentProfile.intendedClass,
      branchId: studentProfile.branchId,
      isAdmin: false,
    })

    const student = {
      _id: studentProfile._id,
      name: studentProfile.name,
      email: studentProfile.email,
      accountType: studentProfile.accountType,
      intendedClass: studentProfile.intendedClass,
      branchId: studentProfile.branchId,
      ...token,
    }

    //return result
    return {
      success: true,
      msg: StudentSuccess.FETCH,
      data: student,
    }
  }

  static async getStudent(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Student"
    )
    if (error) return { success: false, msg: error }

    const students = await StudentRepository.findAllStudentsParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (students.length < 1)
      return { success: true, msg: StudentFailure.FETCH, date: [] }

    return { success: true, msg: StudentSuccess.FETCH, data: students }
  }

  static async updateStudent(payload, id, locals) {
    const { body, image } = payload

    if (!locals.isAdmin) {
      delete body.email
    }

    let status = "active"
    if (body.status) {
      status = body.status
    }

    const findStudent = await StudentRepository.findSingleStudentWithParams({
      _id: new mongoose.Types.ObjectId(id),
    })

    if (!findStudent) return { success: false, msg: StudentFailure.FETCH }

    const student = await StudentRepository.updateStudentDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...body,
        status,
        profileImage: image,
      }
    )

    if (!student) return { success: false, msg: StudentFailure.UPDATE }

    if (student && body.intendedClass) {
      await Promise.all([
        SchoolClassRepository.updateSchoolClassDetails(
          { _id: new mongoose.Types.ObjectId(body.intendedClass) },
          { $push: { studentId: student._id } }
        ),
      ])
    }
    return {
      success: true,
      msg: StudentSuccess.UPDATE,
    }
  }

  static async studentImage(payload, id) {
    const { image } = payload
    const student = await StudentRepository.updateUserProfile(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        profileImage: image,
      }
    )

    if (!student) return { success: false, msg: StudentFailure.UPDATE }

    return { success: true, msg: StudentSuccess.UPDATE }
  }

  static async deleteStudentService(payload) {
    const user = await StudentRepository.deleteStudentById(payload)

    if (!user) return { success: false, msg: `Unable to delete User` }

    return { success: true, msg: `User successfully deleted` }
  }
}

module.exports = { StudentService }
