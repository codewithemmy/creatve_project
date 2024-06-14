const { Remarks } = require("./remarks.model")

class RemarksRepository {
  static async create(payload) {
    return Remarks.create(payload)
  }

  static async findSingleRemarksWithParams(payload, select) {
    const remarks = Remarks.findOne({ ...payload }).select(select)

    return remarks
  }

  static async validateRemarks(payload) {
    return Remarks.exists({ ...payload })
  }

  static async findAllRemarksParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const record = Remarks.find({ ...restOfPayload })
      .populate({
        path: "studentId",
        select: "name email intendedClass parentName profileImage",
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return record
  }

  static async updateRemarksDetails(id, params) {
    return Remarks.findOneAndUpdate(
      { ...id },
      { ...params },
      { new: true, runValidators: true }
    )
  }
}

module.exports = { RemarksRepository }
