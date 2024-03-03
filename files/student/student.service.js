const { default: mongoose } = require("mongoose")
const {
  hashPassword,
  verifyPassword,
  queryConstructor,
} = require("../../utils")
const createHash = require("../../utils/createHash")
const { StudentSuccess, StudentFailure } = require("./student.messages")
const { StudentRepository } = require("./student.repository")
const { LIMIT, SKIP, SORT } = require("../../constants")
const { sendMailNotification } = require("../../utils/email")
const { SchoolClassRepository } = require("../class/schoolClass.repository")

class StudentService {
  static async createStudent(payload, jwtId) {
    const { body, image } = payload
    const { name, email, password, classId } = body
    const validateStudent = await StudentRepository.validateStudent({
      name,
      email,
    })

    if (validateStudent) return { success: true, msg: StudentFailure.EXIST }

    let literalPassword = await hashPassword(password)

    const student = await StudentRepository.create({
      ...body,
      profileImage: image,
      classId,
      password: literalPassword,
      createdBy: new mongoose.Types.ObjectId(jwtId),
    })

    if (!student._id) return { success: false, msg: StudentFailure.CREATE }

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
      msg: StudentSuccess.CREATE,
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
      return { success: false, msg: StudentFailure.FETCH }

    return { success: true, msg: StudentSuccess.FETCH, data: students }
  }

  static async updateStudent(payload, id) {
    const { body, image } = payload

    delete body.email
    const findStudent = await StudentRepository.findSingleStudentWithParams({
      _id: new mongoose.Types.ObjectId(id),
    })

    if (!findStudent) return { success: false, msg: StudentFailure.FETCH }

    const student = await StudentRepository.updateUserDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...body,
        profileImage: image,
      }
    )

    if (!student) return { success: false, msg: StudentFailure.UPDATE }

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
}

module.exports = { StudentService }
