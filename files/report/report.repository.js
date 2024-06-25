const { Report } = require("./report.model")
const mongoose = require("mongoose")

class ReportRepository {
  static async create(payload) {
    return Report.create(payload)
  }

  static async findReportWithParams(payload, select) {
    return Report.find({ ...payload })
      .select(select)
      .populate({
        path: "reporterId",
        select: "firstName lastName name profileImage",
      })
  }

  static async findSingleReport(payload, select) {
    return Report.findOne({ ...payload })
      .select(select)
      .populate({
        path: "reporterId",
        select: "firstName lastName name profileImage",
      })
  }

  static async validateReport(payload) {
    return Report.exists({ ...payload })
  }

  static async findAllReportParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const report = await Report.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "reporterId",
        select: "firstName lastName name profileImage",
      })

    return report
  }

  static async findReportAndUpdate(id, payload) {
    const report = await Report.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { ...payload }
    )

    return report
  }
}

module.exports = { ReportRepository }
