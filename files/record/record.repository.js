const { Record } = require("./record.model")
const mongoose = require("mongoose")

class RecordRepository {
  static async create(payload) {
    return Record.create(payload)
  }

  static async findSingleRecordWithParams(payload, select) {
    const subject = Record.findOne({ ...payload })
      .select(select)
      .populate("studentId")
      .populate("classId")

    return subject
  }

  static async validateRecord(payload) {
    return Record.exists({ ...payload })
  }

  static async findAllRecordParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const record = Record.find({ ...restOfPayload })
      .populate({ path: "branchId", select: "branchName location image" })
      .populate({
        path: "studentId",
        select: "name email intendedClass parentName profileImage",
      })
      .populate({ path: "subjectId" })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return record
  }

  static async updateRecordDetails(id, params) {
    return Record.findOneAndUpdate(
      { ...id },
      { ...params } //returns details about the update
    )
  }
}

module.exports = { RecordRepository }
