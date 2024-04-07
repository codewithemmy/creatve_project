const { Subject } = require("./subject.model")
const mongoose = require("mongoose")

class SubjectRepository {
  static async create(payload) {
    return Subject.create(payload)
  }

  static async findSubjectWithParams(payload, select) {
    return Subject.find({ ...payload }).select(select)
  }

  static async findSingleSubjectWithParams(payload, select) {
    const subject = Subject.findOne({ ...payload }).select(select)

    return subject
  }

  static async validateSubject(payload) {
    return Subject.exists({ ...payload })
  }

  static async findAllSubjectParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const subject = Subject.find({ ...restOfPayload })
      .populate({
        path: "branchId",
        select: "_id branchName location address",
      })
      .populate({ path: "classId", select: "name tag _id" })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return subject
  }

  static async updateSubjectDetails(id, params) {
    return Subject.findOneAndUpdate(
      { ...id },
      { ...params } //returns details about the update
    )
  }

  static async deleteSubjectById(id) {
    return Subject.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) })
  }
}

module.exports = { SubjectRepository }
