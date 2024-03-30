const { Student } = require("./student.model")
const mongoose = require("mongoose")

class StudentRepository {
  static async create(payload) {
    return await Student.create(payload)
  }

  static async findStudentWithParams(payload, select) {
    return await Student.find({ ...payload }).select(select)
  }

  static async findSingleStudentWithParams(payload, select) {
    const student = await Student.findOne({ ...payload }).select(select)

    return student
  }

  static async validateStudent(payload) {
    return Student.exists({ ...payload })
  }

  static async findAllStudentsParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const student = await Student.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return student
  }

  static async updateStudentDetails(id, params) {
    return Student.findOneAndUpdate(
      { ...id },
      { ...params },
      { new: true, runValidators: true }
    )
  }

  static async deleteStudentById(id) {
    return Student.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    })
  }
}

module.exports = { StudentRepository }
