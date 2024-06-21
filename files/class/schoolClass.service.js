const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../utils")
const {
  SchoolClassSuccess,
  SchoolClassFailure,
} = require("./schoolClass.messages")
const { SchoolClassRepository } = require("./schoolClass.repository")
const { RecordRepository } = require("../record/record.repository")

class SchoolClassService {
  static async createSchoolClass(payload, params) {
    const { body, image } = payload
    const schoolClass = await SchoolClassRepository.create({
      ...body,
      branchId: new mongoose.Types.ObjectId(params?.branchId),
      image,
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
    const { students, schoolTerm, ...restOfParams } = params
    let schoolClass = await SchoolClassRepository.findAllSchoolClassParams({
      ...restOfParams,
      limit,
      skip,
      sort,
    })

    if (schoolClass.length < 1)
      return { success: true, msg: SchoolClassFailure.FETCH, data: [] }

    let newStudent
    if (students && schoolTerm && students !== "records") {
      return {
        success: true,
        msg: `Wrong parameter while getting students with total term score`,
      }
    }
    if (!params.branchId) {
      //student indexes
      const studentsWithIndexAndReduce = await Promise.all(
        schoolClass[0]?.studentId.map(async (student) => {
          const record = await RecordRepository.findAllRecordParams({
            studentId: new mongoose.Types.ObjectId(student._id),
            classId: new mongoose.Types.ObjectId(schoolClass[0]._id),
            schoolTerm,
          })
          const termTotalScore = record.reduce(
            (total, score) => total + score.totalScore,
            0
          )

          return {
            ...student, // Spread the student object
            termTotalScore: termTotalScore, // Add the reduce result
          }
        })
      )

      newStudent = studentsWithIndexAndReduce
      if (params && params.students === "records") {
        return {
          success: true,
          msg: SchoolClassSuccess.FETCH,
          data: newStudent,
        }
      }
    }
    return {
      success: true,
      msg: SchoolClassSuccess.FETCH,
      data: schoolClass,
    }
  }

  static async updateSchoolClass(payload, id) {
    const { image, body } = payload
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
          $push: { teacher: new mongoose.Types.ObjectId(body.teacher) },
        }
      )
    } else if (payload.student) {
      schoolClass = await SchoolClassRepository.updateSchoolClassDetails(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $push: { student: new mongoose.Types.ObjectId(body.student) },
        }
      )
    } else {
      schoolClass = await SchoolClassRepository.updateSchoolClassDetails(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          ...body,
          image,
        }
      )
    }

    if (!schoolClass) return { success: false, msg: SchoolClassFailure.UPDATE }

    return {
      success: true,
      msg: SchoolClassSuccess.UPDATE,
    }
  }

  static async deleteSchoolClassService(payload) {
    const schoolClass = await SchoolClassRepository.deleteClassById(payload)

    if (!schoolClass) return { success: false, msg: `Unable to delete class` }

    return { success: true, msg: `Class successfully deleted` }
  }
}

module.exports = { SchoolClassService }
