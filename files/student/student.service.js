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

class StudentService {
  static async createStudent(payload) {
    const { name, contact } = payload.body
    const { image } = payload
    const validateStudent = await StudentRepository.validateStudent({
      name,
      contact,
    })

    if (validateStudent) return { success: true, msg: StudentFailure.EXIST }

    const student = await StudentRepository.create({
      ...payload,
      profileImage: image,
    })

    if (!student._id) return { success: false, msg: StudentFailure.CREATE }

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
