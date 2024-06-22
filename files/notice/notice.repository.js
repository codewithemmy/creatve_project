const { Notice } = require("./notice.model")
const mongoose = require("mongoose")

class NoticeRepository {
  static async create(payload) {
    return Notice.create(payload)
  }

  static async findNoticeWithParams(payload, select) {
    return Notice.find({ ...payload }).select(select)
  }

  static async findSingleNoticeWithParams(payload, select) {
    return Notice.findOne({ ...payload }).select(select)
  }

  static async validateNotice(payload) {
    return Notice.exists({ ...payload })
  }

  static async findAllNoticeParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const notice = await Notice.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return notice
  }

  static async updateModuleDetails(payload, params) {
    return Notice.findOneAndUpdate({ ...payload }, { ...params })
  }

  static async deleteNotice(id) {
    return Notice.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) })
  }
}

module.exports = { NoticeRepository }
