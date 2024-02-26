const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../utils")
const {
  SchoolClassSuccess,
  SchoolClassFailure,
} = require("./schoolClass.messages")
const { SchoolClassRepository } = require("./schoolClass.repository")
const { LIMIT, SKIP, SORT } = require("../../constants")

class SchoolClassService {
  static async createSchoolClass(payload) {
    const { name, level } = payload
    const validateSchoolClass = await SchoolClassRepository.validateSchoolClass(
      {
        name,
        level,
      }
    )

    if (validateSchoolClass)
      return { success: true, msg: SchoolClassFailure.EXIST }

    const schoolClass = await SchoolClassRepository.create({
      ...payload,
    })

    if (!schoolClass._id)
      return { success: false, msg: SchoolClassFailure.CREATE }

    return {
      success: true,
      msg: SchoolClassSuccess.CREATE,
    }
  }

  static async getSchoolClass(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "SchoolClass"
    )
    if (error) return { success: false, msg: error }

    const schoolClass = await SchoolClassRepository.findAllSchoolClassParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (schoolClass.length < 1)
      return { success: false, msg: SchoolClassFailure.FETCH }

    return { success: true, msg: SchoolClassSuccess.FETCH, data: schoolClass }
  }

  static async updateSchoolClass(payload, id) {
    const findSchoolClass =
      await SchoolClassRepository.findSingleSchoolClassWithParams({
        _id: new mongoose.Types.ObjectId(id),
      })

    if (!findSchoolClass)
      return { success: false, msg: SchoolClassFailure.FETCH }

    let schoolClass
    if (payload.teacher) {
      schoolClass = await SchoolClassRepository.updateSchoolClassDetails(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $push: { teacher: new mongoose.Types.ObjectId(payload.teacher) },
        }
      )
    } else if (payload.student) {
      schoolClass = await SchoolClassRepository.updateSchoolClassDetails(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $push: { student: new mongoose.Types.ObjectId(payload.student) },
        }
      )
    } else {
      schoolClass = await SchoolClassRepository.updateSchoolClassDetails(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          ...payload,
        }
      )
    }

    if (!schoolClass) return { success: false, msg: SchoolClassFailure.UPDATE }

    return {
      success: true,
      msg: SchoolClassSuccess.UPDATE,
    }
  }
}

module.exports = { SchoolClassService }
