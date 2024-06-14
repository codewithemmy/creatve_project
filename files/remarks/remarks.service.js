const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../utils")
const { RemarkSuccess, RemarksFailure } = require("./remarks.messages")
const { RemarksRepository } = require("./remarks.repository")

class RemarksService {
  static async createRemarks(remarksPayload) {
    const confirmRecord = await RemarksRepository.validateRemarks({
      schoolTerm: remarksPayload.schoolTerm,
      classId: new mongoose.Types.ObjectId(remarksPayload.classId),
      studentId: new mongoose.Types.ObjectId(remarksPayload.studentId),
    })

    if (confirmRecord) return { success: false, msg: RemarksFailure.EXIST }

    const remarks = await RemarksRepository.create({
      ...remarksPayload,
      subjectId: new mongoose.Types.ObjectId(remarksPayload.subjectId),
      studentId: new mongoose.Types.ObjectId(remarksPayload.studentId),
    })

    if (!remarks._id) return { success: false, msg: RemarksFailure.CREATE }

    return {
      success: true,
      msg: RemarkSuccess.CREATE,
    }
  }

  static async updateRemarks(payload, id) {
    const remarks = await RemarksRepository.updateRemarksDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...payload,
      }
    )

    if (!remarks) return { success: false, msg: RemarksFailure.UPDATE }

    return {
      success: true,
      msg: RemarkSuccess.UPDATE,
    }
  }

  //affective domain update

  static async updateAffectiveDomain(payload, id) {
    const remarks = await RemarksRepository.updateRemarksDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          "affectiveDomain.attentiveness": payload.attentiveness,
          "affectiveDomain.honesty": payload.honesty,
          "affectiveDomain.obedience": payload.obedience,
          "affectiveDomain.neatness": payload.neatness,
          "affectiveDomain.reliability": payload.reliability,
          "affectiveDomain.punctuality": payload.punctuality,
          "affectiveDomain.relations": payload.relations,
          "affectiveDomain.responsibility": payload.responsibility,
          "psychomotorDomain.drawing": payload.drawing,
          "psychomotorDomain.painting": payload.painting,
          "psychomotorDomain.handWriting": payload.handWriting,
          "psychomotorDomain.sports": payload.sports,
          "psychomotorDomain.publicSpeaking": payload.publicSpeaking,
        },
      }
    )

    if (!remarks) return { success: false, msg: RemarksFailure.UPDATE }

    return {
      success: true,
      msg: RemarkSuccess.UPDATE,
    }
  }

  static async getRemarks(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Remarks"
    )
    if (error) return { success: false, msg: error }
    let remarks = await RemarksRepository.findAllRemarksParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (remarks.length < 1) {
      return { success: true, msg: RemarksFailure.FETCH, data: [] }
    }

    return {
      success: true,
      msg: RemarkSuccess.FETCH,
      data: remarks,
    }
  }
}

module.exports = { RemarksService }
