const { default: mongoose } = require("mongoose")
const { queryConstructor } = require("../../utils")
const { RecordSuccess, RecordFailure } = require("./record.messages")
const { RecordRepository } = require("./record.repository")

class RecordService {
  static async createRecord(recordPayload, locals) {
    const { testOne, testTwo, testThree, examScore } = recordPayload
    if (!recordPayload.schoolTerm)
      return { success: false, msg: `School term cannot be blank` }

    if (
      // locals.accountType !== "teacher" ||
      !locals.branchId
    )
      return {
        success: false,
        msg: `Only teachers with a class and branch are allowed to create record`,
      }

    const confirmRecord = await RecordRepository.validateRecord({
      ...recordPayload,
      classId: new mongoose.Types.ObjectId(recordPayload.classId),
      studentId: new mongoose.Types.ObjectId(recordPayload.studentId),
      branchId: new mongoose.Types.ObjectId(locals.branchId),
    })

    if (confirmRecord) return { success: false, msg: RecordFailure.EXIST }

    const record = await RecordRepository.create({
      testOne: testOne ? Number(recordPayload.testOne) : 0,
      testTwo: testTwo ? Number(recordPayload.testTwo) : 0,
      testThree: testThree ? Number(recordPayload.testThree) : 0,
      examScore: examScore ? Number(recordPayload.examScore) : 0,
      classId: new mongoose.Types.ObjectId(recordPayload.classId),
      studentId: new mongoose.Types.ObjectId(recordPayload.studentId),
      branchId: new mongoose.Types.ObjectId(locals.branchId),
    })

    if (!record._id) return { success: false, msg: RecordFailure.CREATE }

    return {
      success: true,
      msg: RecordSuccess.CREATE,
    }
  }

  static async updateRecordService(payload, id) {
    const record = await RecordRepository.updateRecordDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        ...payload,
      }
    )

    if (!record) return { success: false, msg: RecordFailure.UPDATE }

    return {
      success: true,
      msg: RecordSuccess.UPDATE,
    }
  }

  static async getRecordService(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Record"
    )
    if (error) return { success: false, msg: error }

    const record = await RecordRepository.findAllRecordParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (record.length < 1)
      return { success: true, msg: RecordFailure.FETCH, data: [] }

    return { success: true, msg: RecordSuccess.FETCH, data: record }
  }
}

module.exports = { RecordService }
