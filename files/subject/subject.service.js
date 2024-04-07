const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../utils")
const { SubjectSuccess, SubjectFailure } = require("./subject.messages")
const { SubjectRepository } = require("./subject.repository")
const { SchoolClassRepository } = require("../class/schoolClass.repository")

class SubjectService {
  static async createSubject(subjectPayload, locals) {
    if (!locals.branchId)
      return {
        success: false,
        msg: `Admin without a branch cannot create subject`,
      }

    const { name, classId } = subjectPayload

    const classBranch =
      await SchoolClassRepository.findSingleSchoolClassWithParams({
        branchId: new mongoose.Types.ObjectId(locals.branchId),
        _id: new mongoose.Types.ObjectId(classId),
      })

    if (!classBranch)
      return {
        success: false,
        msg: `Selected class does not belong to your branch`,
      }

    const confirmSubject = await SubjectRepository.validateSubject({
      name,
      classId,
      branchId: new mongoose.Types.ObjectId(locals.branchId),
    })

    if (confirmSubject) return { success: false, msg: SubjectFailure.EXIST }

    const subject = await SubjectRepository.create({
      name,
      branchId: new mongoose.Types.ObjectId(locals.branchId),
      classId: new mongoose.Types.ObjectId(classId),
    })

    if (!subject._id) return { success: false, msg: SubjectFailure.CREATE }

    return {
      success: true,
      msg: SubjectSuccess.CREATE,
    }
  }

  static async updateSubjectService(payload, id) {
    const subject = await SubjectRepository.updateSubjectDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...payload,
      }
    )

    if (!subject) return { success: false, msg: SubjectFailure.UPDATE }

    return {
      success: true,
      msg: SubjectSuccess.UPDATE,
    }
  }

  static async getSubjectService(payload, local) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Subject"
    )
    if (error) return { success: false, msg: error }

    let extra = {}
    if (params.class) {
      extra = { branchId: new mongoose.Types.ObjectId(local) }
    }

    const subject = await SubjectRepository.findAllSubjectParams({
      ...params,
      ...extra,
      limit,
      skip,
      sort,
    })

    if (subject.length < 1)
      return { success: true, msg: SubjectFailure.FETCH, data: [] }

    return { success: true, msg: SubjectSuccess.FETCH, data: subject }
  }

  static async deleteSubjectService(payload) {
    const subject = await SubjectRepository.deleteSubjectById(payload)

    if (!subject) return { success: false, msg: `Unable to delete subject` }

    return { success: true, msg: `Subject  successfully deleted` }
  }
}

module.exports = { SubjectService }
